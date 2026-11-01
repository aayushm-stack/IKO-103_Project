# BrahmaPath: Mathematical & Indic Knowledge Systems (IKS) Framework

## Overview & Academic Foundations

BrahmaPath grounds modern digital behavioral modification, habit tracking, and cognitive composure in classical Indic Knowledge Systems (IKS). Rather than using arbitrary Silicon Valley metrics or shame-inducing tracking limits, BrahmaPath translates peer-reviewed psychological methods and timeless Vedic, Ayurvedic, and Yogic treatises into deterministic mathematical algorithms.

---

## 1. Yukta Daily Equilibrium Algorithm

### Canonical Scriptural Foundation
> **Bhagavad Gītā 6.17**  
> *युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु। युक्तस्वप्नावबोधस्य योगो भवति दुःखहा॥*  
> *"For one whose Āhāra (intake) and Vihāra (recreation) are regulated, whose efforts in actions are balanced, and whose sleep (Nidrā) and waking are disciplined, Yoga destroys all afflictions."*

### Mathematical Formulation
The daily biological equilibrium ($Yukta \in [0, 100]$) is computed across the three foundational pillars of health (*Trayopastambha*):

$$Yukta_{\text{raw}} = 0.40 \times S_{\text{Āhāra}} + 0.30 \times S_{\text{Nidrā}} + 0.30 \times S_{\text{Brahmacarya}}$$

Where:
- **$S_{\text{Āhāra}} \in [0, 10]$**: Scaled to 40% total weight. Encompasses sensory intake and relative screen time.
- **$S_{\text{Nidrā}} \in [0, 10]$**: Scaled to 30% total weight. Evaluates circadian duration ($7.0 - 8.5\text{ hrs}$ optimal).
- **$S_{\text{Brahmacarya}} \in [0, 10]$**: Scaled to 30% total weight. Evaluates focused deep study blocks ($4\text{+ hrs}$ optimal) and sensory conservation.

### Natural Cognitive Drift (Decay Function)
In the absence of conscious daily observation, mental discipline naturally experiences Tamasic entropy (*Pramāda*). For unlogged historical days:

$$Yukta_{t} = \max\left(0, \, \text{round}\left(Yukta_{t-1} \times 0.95\right)\right)$$

A gentle, non-punitive $5\%$ exponential decay simulates natural cognitive drift without demoralizing the Sadhaka.

---

## 2. Katha Upanishad Chariot Composure Model

### Canonical Scriptural Foundation
> **Kaṭha Upaniṣad 1.3.3–4**  
> *आत्मानँ रथिनं विद्धि शरीरँ रथमेव तु। बुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च॥*  
> *इन्द्रियाणि हयानाहुर्विषयाँस्तेषु गोचरान्।*  
> *"Know the Self as the rider of the chariot, and the body as the chariot itself. Know the intellect (Buddhi) as the charioteer, and the mind (Manas) as the reins. The senses (Indriyas) are the horses, and sense-objects (Vishayas) are the roads they traverse."*

### Mathematical Formulation
Mental composure ($C \in [0, 100]$) is an objective function of the three fundamental cosmic qualities (*Triguṇa*):

$$C = 0.40 \times G_{\text{Sattva}} + 0.30 \times (100 - G_{\text{Rajas}}) + 0.30 \times (100 - G_{\text{Tamas}})$$

Subject to the conservation constraint:
$$G_{\text{Sattva}} + G_{\text{Rajas}} + G_{\text{Tamas}} = 100\%$$

### Dynamic Horse Poses & Mental States
The visual Chariot reflects the Sadhaka's physiological state deterministically:
1. **Resting Pose** (Tamasic Drift): $G_{\text{Tamas}} > 50\%$ or Sleep $< 5\text{ hrs}$. Lethargy, inertia, circadian disruption.
2. **Galloping Pose** (Rajasic Overdrive): $G_{\text{Rajas}} > 50\%$ or Screen Time $> 1.25 \times \text{Baseline}$. Restlessness, agitation, compulsive stimulation.
3. **Brisk Pose** (Dynamic Balance): $G_{\text{Sattva}} \ge 50\%$ and $G_{\text{Rajas}} \ge 30\%$. Active execution, energetic Sattvic momentum.
4. **Calm Pose** (Sattvic Mastery): $G_{\text{Sattva}} \ge 60\%$. Serene poise, laser clarity, mastered reins.

---

## 3. Self-Anchored Relative Screen Time Model

### Canonical Scriptural Foundation
> **Caraka Saṁhitā, Sūtrasthāna 5.3 & 28.34**  
> *मात्राशी स्यात्। आहारमात्रा पुनरग्निबलापेक्षिणी॥*  
> *"One should partake of food (intake) in measured quantity. The exact measure, however, depends intrinsically on the individual's digestive fire and unique constitution."*

### Formulation
Rigid minute cutoffs (e.g. 60 or 120 mins) trigger cognitive dissonance and shame. BrahmaPath pioneers the Self-Anchored Baseline model where the Sadhaka sets their honest daily average ($B_{\text{user}}$, default $6.0\text{ hrs}$), snapshotting $B_{\text{logged}}$ permanently on each day's log.

The intake ratio $R$ is defined as:
$$R = \frac{T_{\text{digital}}}{B_{\text{logged}}}$$

### 4-Zone Relative Evaluation
$$\text{Evaluation}(R) = \begin{cases} 
\text{Deep Recovery} & R \le 0.50 \implies 10\text{ pts}, \, +4\text{ bonus Sattva} \\
\text{Steady Reduction} & 0.50 < R \le 0.85 \implies 8\text{ pts}, \, +2\text{ bonus Sattva} \\
\text{Maintained Baseline} & 0.85 < R \le 1.15 \implies 6\text{ pts}, \, \text{Neutral poise} \\
\text{Above Baseline} & R > 1.15 \implies \max(0, \, 5 - \lfloor (R - 1.15) \times 10 \rfloor)\text{ pts}
\end{cases}$$

Past achievements stored in the Vault are mathematically invariant to future adjustments of $B_{\text{user}}$.

---

## 4. Pratipakṣa Bhāvana Cognitive Quotient (PRQ)

### Canonical Scriptural Foundation
> **Patañjali Yoga Sūtra 2.33**  
> *वितर्कबाधने प्रतिपक्षभावनम्॥*  
> *"When the mind is troubled or pulled by destructive impulses (Vitarka), cultivate opposite cognitive counter-currents (Pratipakṣa Bhāvana)."*

### Formulation
When an impulse or urge strikes, the Sadhaka engages the Gita 2.62–63 Pause Gate. The Pratipaksha Reframe Quotient ($PRQ \in [0, 100]$) scores deliberate cognitive reconditioning:

$$PRQ = \min\left(100, \, N_{\text{reframes}} \times 20 + N_{\text{pauses}} \times 10\right)$$

Where:
- $N_{\text{reframes}}$: Completed 4-step cognitive reframes (Identify Triggers $\to$ Intercept Attachment $\to$ Select Micro-Swap $\to$ Sthirata Affirmation).
- $N_{\text{pauses}}$: Active invocations of the emergency Pause Gate.

---

## 5. Āyurvedic Tridoṣa Dynamic Balance

### Canonical Scriptural Foundation
> **Caraka Saṁhitā, Sūtrasthāna 1.57**  
> *वायुः पित्तं कफश्चोक्तः शारीरो दोषसंग्रहः। मानसः पुनरुद्दिष्टो रजश्च तम एव च॥*  
> *"Vāta, Pitta, and Kapha constitute the bodily Doṣas; Rajas and Tamas constitute the mental Doṣas."*

### Diagnostics & Real-Time Balancing
- **Vāta Aggravation**: Screen addiction, sleep irregularity, rapid sensory hopping $\implies$ Grounding rituals, Abhyanga rest reminders, slow coherent breathing.
- **Pitta Aggravation**: Frustration, comparison envy, hyper-intense competitive burnout $\implies$ Sheetali/Sitkari cooling breath, Muditā meditation.
- **Kapha Aggravation**: Prolonged digital lethargy, morning oversleeping, heavy inertia $\implies$ Surya Bhedana, vigorous walking, immediate Sattvic micro-swaps.
