# Transfusion Risk Prediction

A small-data machine learning project that predicts blood transfusion need from routine patient vitals — built, debugged, and evaluated in the open. This README documents not just the final model, but the methodology journey that got it there, including two rounds of data leakage that were found and fixed.

**Live interactive demo:** `transfusion_dashboard.html` — a wizard-style risk checker that runs the actual trained model client-side (no server, no API calls — the exported model executes directly in your browser).

---

## What this project does

Given a small set of routine ICU-style vitals — heart rate, respiratory rate, oxygen saturation, systolic/diastolic blood pressure, and sex — the model estimates the likelihood that a patient stay involved a transfusion need. The dataset is a MIMIC-style demo (206 patient stays, 14 positive cases), built from a synthetic/simulated pipeline for portfolio purposes, not real clinical records.

The full pipeline covers:
- SQL-based data ingestion (patients, vitals, lab tables → MySQL)
- Data cleaning and aggregation (one row per patient stay)
- Leakage-safe feature selection
- Class imbalance handling (SMOTE, applied correctly inside cross-validation folds)
- Model comparison (Random Forest vs. Logistic Regression) via stratified 5-fold cross-validation
- Threshold selection and calibration analysis
- Client-side deployment of the trained model via `m2cgen`

## The honest story

This project's real value isn't a single accuracy number — it's the debugging journey, which is worth being upfront about:

1. **Label leakage, found twice.** The target label was originally defined directly from the same vitals used as model features — first as a pandas formula, then discovered to be baked into the underlying SQL view itself after the first fix. Both were traced and corrected by explicitly excluding every column (and anything derived from them) that the label formula depended on.
2. **A database join-explosion bug.** An early version of the pipeline joined two tables that both had multiple rows per patient stay, without a shared row-level key — turning ~222 patients into over 2 million joined rows. Diagnosed by checking row counts against `GROUP BY` counts, and fixed by aggregating each source table to one row per stay before joining.
3. **A reproducibility bug.** The synthetic hemoglobin generator used an unseeded random function, meaning the dataset's labels silently changed every time the pipeline was re-run — undermining any claim that results were stable. Fixed with a seeded random generator.
4. **An honest small-sample evaluation.** With only 14 positive cases in 206 rows, a single train/test split is unreliable — one particular split produced a misleadingly low score, while cross-validation across 5 folds gave a more stable, trustworthy estimate with a reported standard deviation, not just a single number.

## Results

*(Fill in with your final, reproducible cross-validation run — see the notebook's cross-validation cells for exact figures.)*

| Model | Mean ROC-AUC | Std |
|---|---|---|
| Random Forest (+ SMOTE) | `[fill in]` | `[fill in]` |
| Logistic Regression (+ SMOTE) | `[fill in]` | `[fill in]` |

Both models were evaluated on the same 5 stratified folds, with SMOTE applied fresh inside each fold to avoid synthetic-sample leakage across folds. A precision-recall curve was used to select an operating threshold favoring recall (missing a transfusion need is costlier than a false alarm), and a calibration curve was checked to see how trustworthy the predicted probabilities themselves are — expect this to look noisy given the small positive-case count, which is itself an honest finding, not a flaw.

## Limitations

- **Small sample size.** 206 patient stays and 14 positive cases is not enough data to draw strong conclusions — treat all metrics as indicative, not definitive.
- **Synthetic/demo label.** The transfusion-need label is rule-derived for this demo, not a real clinical outcome — this project demonstrates methodology, not validated clinical performance.
- **No more real data was available** for this iteration; a larger patient sample would do more for this project's reliability than any further modeling technique.

## Project structure

```
├── Pred_Analytics_for_Transfusion.ipynb   # Full pipeline: cleaning, EDA, modeling, evaluation
├── transfusion_dashboard.html             # Interactive demo — runs the real trained model
├── model.js                               # Trained Random Forest, exported via m2cgen
├── requirements.txt
├── .gitignore                             # Excludes .env (DB credentials)
└── README.md
```

## Running it yourself

1. Create a `.env` file with your own `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — the notebook reads credentials from environment variables, never hardcoded.
2. Run the notebook top to bottom (Kernel → Restart → Run All) to reproduce the full pipeline, from data ingestion through final model export.
3. Open `transfusion_dashboard.html` directly in a browser (or serve the repo via GitHub Pages) to try the interactive demo — it runs entirely client-side.

---

*Portfolio project. Not medical advice.*
