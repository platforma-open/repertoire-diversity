import pandas as pd
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
data = pd.read_csv(input_file, sep="\t")

totals = data.groupby('sampleId')['count'].sum().reset_index()
# Calculate 20th percentile across all totals
q20 = totals['count'].quantile(0.2)
# Find the minimum value that is above 0.5*q20
min_above_threshold = totals[totals['count'] > 0.5 * q20]['count'].min()
fixed_auto_downsampling_value = min_above_threshold if not pd.isna(
    min_above_threshold) else q20


def downsample(df, downsampling):
    if downsampling['type'] == "none":
        return df

    if downsampling['type'] == "top":
        top_n = downsampling['n']
        return df.nlargest(top_n, 'count')

    if downsampling['type'] == "cumtop":
        top_fraction = downsampling['n']
        target_count = top_fraction * df['count'].sum()

        sorted = df.sort_values('count', ascending=False)

        sorted['cumsum'] = sorted['count'].cumsum()
        selected_rows = sorted[sorted['cumsum'] <= target_count]

        # If no rows meet the criteria (rare case), take at least the top row
        if selected_rows.empty:
            selected_rows = sorted.head(1)
        return selected_rows

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

        df["count"] = rng.multivariate_hypergeometric(
            df["count"].astype(np.int64), int(value))

        df = df.loc[df["count"] != 0]
        return df

    else:
        raise ValueError(f"Invalid downsampling type: {downsampling['type']}")


def chao1(df):
    singletons = df[df['count'] == 1.]['count'].count()
    doubletons = df[df['count'] == 2.]['count'].count()
    f0 = singletons * (singletons - 1) / 2 / (doubletons + 1)
    observed = df['count'].count()
    chao1 = observed + f0
    return chao1


def d50(df):
    # Return zero if the dataframe is empty
    if df.empty:
        return 0
    # Sort the dataframe by count in descending order
    sorted_df = df.sort_values('count', ascending=False).reset_index(drop=True)

    # Calculate the total sum of counts
    total_count = sorted_df['count'].sum()

    # Calculate the target count (50% of total)
    target_count = total_count * 0.5

    # Calculate cumulative sum
    sorted_df['cumsum'] = sorted_df['count'].cumsum()

    # Find the number of clonotypes needed to reach 50% of the total count
    return len(sorted_df[sorted_df['cumsum'] <= target_count]) + 1


def efronThisted(df):
    for depth in range(1, 21):
        h = np.zeros(depth)
        nx = np.zeros(depth)
        for y in range(1, depth+1):
            nx[y-1] = len(df[df['count'] == y].index)
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
        S = len(df.index) + sum(l)
        D = np.sqrt(sum(p))
        CV = D / S
        if CV >= 0.05:
            break
    return S


def observed(df):
    return len(df)


def shannonWienerIndex(df):
    return -(df['fraction'] * np.log(df['fraction'])).sum()


def shannonWiener(df):
    return np.exp(shannonWienerIndex(df))


def normalizedShannonWiener(df):
    return shannonWienerIndex(df) / np.log(len(df))


def inverseSimpson(df):
    return 1 / (df['fraction'] * df['fraction']).sum()


def gini(df):
    return 1 - (-1/inverseSimpson(df))


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
        return gini(df)
    else:
        raise ValueError(f"Invalid metric: {type}")


result = pd.DataFrame({'sampleId': data['sampleId'].unique()})
bySample = data.groupby('sampleId')

for index, metric in enumerate(params):
    metric_id = "d-" + str(index)
    result[metric_id] = None
    for sampleId, df in bySample:
        downsampled = downsample(df.reset_index(), metric["downsampling"])
        downsampled['fraction'] = downsampled['count'] / \
            downsampled['count'].sum()
        result.loc[result['sampleId'] == sampleId, metric_id] =\
            calculateMetric(metric["type"], downsampled)

result.to_csv('result.tsv', sep='\t', index=False)
