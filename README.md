# Diversity Analysis

Quantify and compare repertoire diversity. This Platforma block computes the standard diversity metrics — richness estimators, evenness indices, and dominance measures — for immune receptor repertoires and peptide libraries, with depth normalization so samples sequenced unevenly can be compared honestly.

Open-source analysis block for Platforma, the biologics discovery platform by MiLaboratories. For the full no-code workflow, see [platforma.bio](https://platforma.bio/).

> **Naming:** this block appears as **Diversity Analysis** in the Platforma app; the repository is named `repertoire-diversity`. They are the same block.

## What it does

"Diverse" is not one property. A repertoire can contain very many distinct sequences yet be dominated by a handful of expanded clones; another can hold fewer sequences distributed evenly. Those are different biological situations, and a single number cannot express both — which is why the block computes several complementary families of metric rather than one index.

**Richness** counts distinct sequences: the observed count, plus **Chao1** and **Efron-Thisted** estimators, which correct for the sequences your sequencing depth almost certainly missed.

**Evenness** describes how abundance is distributed across those sequences: **Shannon-Wiener** and **Inverse Simpson**, both accounting for the fact that a repertoire of one dominant clone plus a long tail is less diverse than an even one with the same richness.

**Dominance** measures concentration directly: **D50** — how many sequences make up half the repertoire — and the **Gini** coefficient.

All of these are depth-sensitive, so a deeper-sequenced sample looks more diverse whether or not it is. The block normalizes before computing: either statistically downsample to a common size with hypergeometric sampling, or restrict to the top N or top percentage of sequences by abundance. That is what makes cross-sample comparison meaningful.

Results come as a table of every metric per sample and a diversity graph for comparing across samples and conditions.

## Inputs & outputs

* **Input:** per-sample abundance counts for clonotypes or peptides, from any Platforma clonotyping, import, or peptide profiling block.
* **Output:** all diversity metrics per sample as columns, plus a comparison graph.

## Specifications

| | |
|---|---|
| Block title in app | Diversity Analysis |
| Richness | Observed richness, Chao1, Efron-Thisted |
| Evenness | Shannon-Wiener, Inverse Simpson |
| Dominance | D50, Gini coefficient |
| Normalization | Hypergeometric downsampling to a common size, or selecting the top N or top percentage by abundance |
| Modalities | TCR and BCR repertoires, peptide libraries |
| Views | Metrics table, diversity graph |

## Use cases

* **Compare diversity across conditions:** test whether treatment, vaccination, or disease changed repertoire diversity.
* **Depth-fair comparison:** normalize unevenly sequenced samples before comparing, so the result reflects biology.
* **Detect clonal expansion:** use dominance measures to identify samples where a few clones took over, which richness alone would not show.
* **Library QC:** confirm a synthetic or peptide library is as diverse and as even as intended.
* **Selection monitoring:** watch diversity collapse across selection rounds as binders take over — the expected signature of a working campaign.
* **Estimate unseen diversity:** use Chao1 and Efron-Thisted to estimate how much of the repertoire your sequencing missed.
* **Longitudinal tracking:** follow diversity across timepoints in an immune response.

## FAQ

### Which metric should I report?

Usually more than one, because they answer different questions. Richness for how many distinct sequences exist, evenness for how abundance is spread across them, dominance for how concentrated the top of the distribution is. Reporting a single index tends to hide the effect you are looking for.

### What is the difference between richness and evenness?

Richness counts distinct sequences and ignores their abundances. Evenness accounts for abundance: a repertoire where one clone holds most of the reads is less diverse than an even one with the same count of distinct sequences. Shannon-Wiener and Inverse Simpson both weigh this.

### What do Chao1 and Efron-Thisted add over the observed count?

They estimate the sequences present but not sampled. Observed richness is always an underestimate at realistic sequencing depths; these estimators extrapolate from how many singletons and rare sequences you saw to approximate the true total.

### What is D50?

The number of sequences accounting for half of the repertoire's total abundance. A small D50 means a few clones dominate; a large one means abundance is spread widely. It is one of the most directly interpretable dominance measures.

### Why do I need to normalize?

Because every one of these metrics is sensitive to sequencing depth. Compare a deeply sequenced sample to a shallow one without normalizing and the deeper one looks more diverse regardless of the underlying biology. Normalizing first is what makes the comparison about the samples rather than about the sequencing.

### Which normalization should I use?

Hypergeometric downsampling to a common size is the statistically standard choice and the right default. Restricting to the top N or top percentage by abundance is useful when the question is specifically about the dominant part of the repertoire.

### Does it work on peptide libraries?

Yes. Any per-sample abundance data works, including peptide display libraries — where diversity collapse across selection rounds is often exactly the signal of interest.

### How does this relate to Rarefaction Analysis?

[Rarefaction Analysis](https://github.com/platforma-open/rarefaction) plots how observed richness grows with sampling depth, which shows whether you sequenced deeply enough. This block computes summary metrics at a fixed normalized depth for comparing samples. Rarefaction answers "did I sequence enough?"; diversity analysis answers "how do these samples differ?"

## Documentation

Step-by-step guide: [Diversity Analysis](https://docs.platforma.bio/guides/vdj-analysis/diversity-analysis/)

## Part of the Platforma ecosystem

This block is part of [Platforma](https://platforma.bio/) by [MiLaboratories](https://github.com/milaboratory). Explore the other open-source blocks at [github.com/platforma-open](https://github.com/platforma-open) and the docs for V(D)J analysis at [docs.platforma.bio/biology-guides/vdj-analysis](https://docs.platforma.bio/biology-guides/vdj-analysis/).
