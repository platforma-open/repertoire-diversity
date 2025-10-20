import polars as pl
import numpy as np
from numpy.random import default_rng
import json
from scipy.special import binom


# sample cloneKey count

input_file = "input.tsv"
params_file = "metrics.json"


# Parse the parameters from the JSON file
def parse_params():
    try:
        with open(params_file, 'r') as f:
            params = json.load(f)
        return params
    except FileNotFoundError:
        print(f"Error: Parameters file '{params_file}' not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Could not parse '{params_file}' as valid JSON.")
        return {}


params = parse_params()
data = pl.read_csv(input_file, separator="\t")

totals = data.group_by('sampleId').agg(pl.sum('count'))
q20 = totals['count'].quantile(0.2, interpolation="linear")

min_above_threshold = totals.filter(
    pl.col('count') > 0.5 * q20)['count'].min()
fixed_auto_downsampling_value = min_above_threshold if min_above_threshold is not None else q20


def downsample(df, downsampling):
    if downsampling['type'] == "none":
        return df

    if downsampling['type'] == "top":
        top_n = downsampling['n']
        return df.top_k(top_n, by='count')

    if downsampling['type'] == "cumtop":
        top_fraction = downsampling['n']
        target_count = top_fraction * df['count'].sum()

        sorted_df = df.sort('count', descending=True)

        sorted_df = sorted_df.with_columns(
            pl.col('count').cumsum().alias('cumsum'))
        selected_rows = sorted_df.filter(pl.col('cumsum') <= target_count)

        # If no rows meet the criteria (rare case), take at least the top row
        if selected_rows.is_empty():
            selected_rows = sorted_df.head(1)
        return selected_rows.drop('cumsum')

    elif downsampling['type'] == "hypergeometric":
        if downsampling['valueChooser'] == "min":
            value = totals['count'].min()
        elif downsampling['valueChooser'] == "fixed":
            value = downsampling['n']
        elif downsampling['valueChooser'] == "auto":
            value = fixed_auto_downsampling_value

        if df['count'].sum() < value:
            return df

        rng = default_rng(31415)  # always fix seed for reproducibility

        new_counts = rng.multivariate_hypergeometric(
            df["count"].to_numpy().astype(np.int64), int(value))

        df = df.with_columns(pl.Series("count", new_counts))
        df = df.filter(pl.col("count") != 0)
        return df

    else:
        raise ValueError(f"Invalid downsampling type: {downsampling['type']}")


def chao1(df):
    singletons = df.filter(pl.col('count') == 1.0).height
    doubletons = df.filter(pl.col('count') == 2.0).height
    f0 = singletons * (singletons - 1) / 2 / \
        (doubletons + 1) if doubletons > -1 else 0
    observed = df.height
    chao1 = observed + f0
    return chao1


def d50(df):
    # Return zero if the dataframe is empty
    if df.is_empty():
        return 0
    # Sort the dataframe by count in descending order
    sorted_df = df.sort('count', descending=True)

    # Calculate the total sum of counts
    total_count = sorted_df['count'].sum()

    # Calculate the target count (50% of total)
    target_count = total_count * 0.5

    # Calculate cumulative sum
    sorted_df = sorted_df.with_columns(
        pl.col('count').cum_sum().alias('cumsum'))

    # Find the number of clonotypes needed to reach 50% of the total count
    return sorted_df.filter(pl.col('cumsum') <= target_count).height + 1


def efronThisted(df):
    for depth in range(1, 21):
        h = np.zeros(depth)
        nx = np.zeros(depth)
        for y in range(1, depth+1):
            nx[y-1] = df.filter(pl.col('count') == y).height
            for x in range(1, y+1):
                coeff = binom(y-1, x-1)
                if x % 2 == 1:
                    h[x-1] += coeff
                else:
                    h[x-1] -= coeff
        l = []
        p = []
        for i in range(depth):
            l.append(h[i] * nx[i])
            p.append(h[i] * h[i] * nx[i])
        S = df.height + sum(l)
        if S == 0:
            return S
        D = np.sqrt(sum(p))
        CV = D / S
        if CV >= 0.05:
            break
    return S


def observed(df):
    return df.height


def shannonWienerIndex(df):
    return -(df['fraction'] * np.log(df['fraction'])).sum()


def shannonWiener(df):
    return np.exp(shannonWienerIndex(df))


def normalizedShannonWiener(df):
    return shannonWienerIndex(df) / np.log(df.height)


def inverseSimpson(df):
    return 1 / (df['fraction'] * df['fraction']).sum()


def giniSimpson(df):
    return 1 - (df['fraction'] * df['fraction']).sum()


def giniIndex(df):
    # Gini coefficient can be calculated on sorted fractions
    fractions = df['fraction'].sort().to_numpy()
    n = len(fractions)
    if n == 0:
        return 0.0
    index = np.arange(1, n + 1)
    # Gini coefficient formula
    return (2 * np.sum(index * fractions)) / (n * np.sum(fractions)) - ((n + 1) / n)


def calculateMetric(type, df):
    if type == "chao1":
        return chao1(df)
    elif type == "d50":
        return d50(df)
    elif type == "efronThisted":
        return efronThisted(df)
    elif type == "observed":
        return observed(df)
    elif type == "shannonWienerIndex":
        return shannonWienerIndex(df)
    elif type == "shannonWiener":
        return shannonWiener(df)
    elif type == "normalizedShannonWiener":
        return normalizedShannonWiener(df)
    elif type == "inverseSimpson":
        return inverseSimpson(df)
    elif type == "gini":
        return giniIndex(df)
    elif type == "giniSimpson":
        return giniSimpson(df)
    else:
        raise ValueError(f"Invalid metric: {type}")


all_results = []
for sampleId_tuple, df in data.group_by('sampleId'):
    sampleId = sampleId_tuple[0] if isinstance(
        sampleId_tuple, tuple) else sampleId_tuple
    sample_results = {'sampleId': sampleId}
    for index, metric in enumerate(params):
        metric_id = "d-" + str(index)
        downsampled = downsample(df, metric["downsampling"])

        value = 0.0
        if not downsampled.is_empty():
            total_count = downsampled['count'].sum()
            if total_count > 0:
                downsampled = downsampled.with_columns(
                    (pl.col('count') / total_count).alias('fraction'))
                metric_value = calculateMetric(metric["type"], downsampled)
                value = float(
                    metric_value) if metric_value is not None else 0.0

        sample_results[metric_id] = value
    all_results.append(sample_results)

result = pl.DataFrame(all_results)
result.write_csv('result.tsv', separator='\t')
