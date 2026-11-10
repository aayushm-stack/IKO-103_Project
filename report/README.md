# BrahmaPath Technical Report & Academic Paper

This directory contains the publication-grade academic research paper and technical architecture documentation for **BrahmaPath: An Offline-First Indigenous Psychometric State Machine and Digital Therapeutics Platform for Civilian Focus and Frontline Defense Equilibrium**.

---

## 📄 Document & Source Files

- **`IKO_103_Project.pdf`**: The complete, pre-compiled publication-grade academic research paper ready for immediate reading and evaluation.
- **`main.tex`**: The primary LaTeX document source formatted in standard A4 article class (`11pt, a4paper`) with full mathematical derivations, comparative prior art analysis (Table 1), full-day behavioral simulation (Table A), cross-stage parameter schema comparison (Table B), and the complete bibliography.
- **`references.bib`**: BibTeX bibliography database containing all 14 peer-reviewed, military psychiatry, clinical psychometric, patent, and scriptural citations.

---

## 🛠️ Compilation Instructions

`main.tex` is engineered to be self-contained and free of external non-standard dependencies. It includes an embedded bibliography block as well as the external `.bib` file so it can compile in a single pass without BibTeX or in a full standard toolchain.

### Option 1: Overleaf (Recommended for Fast Cloud Compilation)

1. Zip the `report/` folder containing `main.tex` and `references.bib`.
2. Open [Overleaf](https://www.overleaf.com), click **New Project** $\rightarrow$ **Upload Project**, and upload the `.zip`.
3. Set the compiler to **pdfLaTeX** (default) or **XeLaTeX**, and click **Recompile**.
4. Download the generated publication-ready PDF.

### Option 2: Local Compilation (TeX Live, MiKTeX, or MacTeX)

Ensure a standard TeX distribution is installed (`texlive-full` on Linux/Debian, `MiKTeX` on Windows, or `MacTeX` on macOS).

Run in your terminal from inside the `report/` directory:

```bash
# Method A: Using latexmk (Automated multi-pass)
latexmk -pdf main.tex

# Method B: Using standard pdflatex
pdflatex main.tex
pdflatex main.tex
```

### Option 3: Automated GitHub Actions CI/CD Workflow

You can automatically compile and release the PDF on every commit or pull request. Create `.github/workflows/build-report.yml` in your repository:

```yaml
name: Compile LaTeX Research Report

on:
  push:
    paths:
      - 'report/**'
  workflow_dispatch:

jobs:
  build_latex:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Compile LaTeX Document
        uses: dante-ev/latex-action@v0.2.0
        with:
          root_file: main.tex
          working_directory: report
          args: "-pdf -interaction=nonstopmode"

      - name: Upload PDF Artifact
        uses: actions/upload-artifact@v4
        with:
          name: BrahmaPath_Technical_Report
          path: report/main.pdf
```

---

## 🔬 Document Structure Summary

| Section | Focus & Key Contents |
| :--- | :--- |
| **§ 1 Abstract & Keywords** | Mathematical equilibrium framework, offline-first deterministic state machine, zero-cloud privacy. |
| **§ 2 Introduction & Target Audience** | Universal human crisis, digital hyper-fragmentation, two-stage architecture (Civilian vs. Defense), database immutability. |
| **§ 3 Literature Review & Prior Art** | Patent comparison (Table 1: AyurAi, Pear Therapeutics, Periyasamy, etc.), TKDL non-preemption, IIT Mandi IKSMHA alignment. |
| **§ 4 Core Mathematical Models** | Trayopastambha $\mathcal{Y}_d$, Piecewise Screen Time $r_d$, Sleep Curve $S(h)$ & Split-Sentry Kūrma, PRQ Interceptor $\mathcal{P}_d$, Bhāva Compass $\mathcal{B}_d$, Master Chariot Index $\mathcal{C}_d$, and Momentum $\mathcal{M}_d$. |
| **§ 5 Behavioral Telemetry & Verification** | Table A (Full-day telemetry simulation: 07:00 AM to 09:00 PM) and Table B (Cross-stage parameter schema comparison: 16 vs. 22 inputs). |
| **§ 6 Feature Curation (6 Groups)** | Foundational Saṅkalpa, Sādhanā Hub (Civilian vs. Defense), Impulse Interceptor (48 micro-swaps), Bhāva Compass (Sahyogi Battle-Buddy kits & Tele-MANAS 14416). |
| **§ 7 Native Android OS Engine** | Capacitor `LocalNotificationManager` repetition bug fix, 7-day rolling explicit `at: Date` scheduler, battery optimization whitelisting. |
| **§ 8 Discussion & Chatbot Rejection** | Circadian audio guide integration, IIT Mandi clinical trials, deliberate rejection of LLM chatbots (zero hallucination, zero OPSEC risk, deterministic action). |
| **§ 9 Bibliography** | 14 rigorous academic, clinical, and primary canonical citations. |
