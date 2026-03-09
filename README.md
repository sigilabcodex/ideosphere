# ideosphere
Ideosphere is a privacy-first, open-source tool for exploring political and ideological thought as a multidimensional field. Instead of reducing beliefs to simple left–right labels, it maps ideas across multiple axes and layers—descriptive, pragmatic, and aspirational—visualizing a user’s ideological landscape as a dynamic probability cloud.

# Ideosphere — Axis Specification v0.01

This document defines the first set of core ideological axes used by the Ideosphere model.

Ideosphere maps political and ideological positions as probabilistic fields across multiple axes rather than single coordinates.

Each axis represents a recurring political question found across historical and cultural contexts.

Axes are evaluated across **interpretive layers** and through **questions of varying abstraction levels**.

---

# Interpretive Layers

Each question belongs to one of the following layers.

These layers distinguish between descriptive analysis, pragmatic judgment, and normative aspiration.

## Descriptive
How the user believes the world **actually functions today**.

Focus:
- institutional behavior
- power dynamics
- real incentives

## Pragmatic
What the user believes is **feasible or desirable within current constraints**.

Focus:
- reform
- governance feasibility
- strategic compromise

## Aspirational
What the user believes would be **best in principle**, regardless of feasibility.

Focus:
- ideals
- long-term visions
- philosophical preference

## Strategic
What the user would **personally support or attempt in practice**.

Focus:
- political strategy
- institution building
- reform vs exit

---

# Question Abstraction Levels

Questions may be written at different levels of abstraction.

## Concrete
Specific situations, examples, or policies.

## Institutional
Questions about systems, laws, or governance structures.

## Abstract
Philosophical or theoretical statements about political order.

The system may ask multiple abstraction levels from the same question family to refine interpretation.

---

# Core Axes (v0.01)

The following eight axes form the foundation of Ideosphere's first prototype.

---

# AXIS 01 — Coordination of Society

## Definition

How complex societies organize economic and social activity.

This axis captures beliefs about how order emerges, whether through centralized planning, administrative systems, market processes, or distributed networks.

## Captures

- economic coordination
- social coordination
- institutional complexity
- emergent vs planned order

## Does NOT capture

- moral judgments about fairness
- attitudes toward inequality

## Primary Branches

1. Central Planning  
2. Administrative Coordination  
3. Regulated Market Coordination  
4. Emergent Market Order  
5. Informal / Networked Coordination

## Example Questions

Descriptive / Abstract  
> In practice, social outcomes are shaped more by distributed incentives than by official plans.

Pragmatic / Institutional  
> Governments should set general rules but avoid directing economic outcomes in detail.

Aspirational / Abstract  
> The healthiest societies are those where order emerges voluntarily rather than being imposed.

Strategic / Concrete  
> When centralized institutions fail, building parallel local systems is preferable to waiting for reform.

---

# AXIS 02 — Locus of Legitimate Authority

## Definition

The perceived source of legitimate political authority.

This axis distinguishes between authority derived from tradition, divine sanction, democratic consent, technical expertise, or voluntary agreement.

## Captures

- legitimacy models
- political authority
- revocability of power

## Primary Branches

1. Sacred / Divine Legitimacy  
2. Hereditary Legitimacy  
3. Constitutional Legitimacy  
4. Democratic Legitimacy  
5. Technocratic Legitimacy  
6. Voluntary / Contractual Legitimacy

## Example Questions

Descriptive  
> In practice, authority often comes from informal elite networks rather than official institutions.

Pragmatic  
> Constitutional systems provide the most stable foundation for legitimate governance.

Aspirational  
> Legitimate authority should ultimately arise from voluntary consent.

Strategic  
> Political power should be decentralized wherever possible.

---

# AXIS 03 — Scale of Governance

## Definition

The appropriate geographic or social scale at which political power should operate.

## Primary Branches

1. Global / Supranational  
2. Civilizational / Imperial  
3. Nation-State  
4. Regional / Federal  
5. Local / Municipal  
6. Individual / Secessionary

## Example Questions

Concrete  
> Many political decisions should be handled at the local level rather than nationally.

Institutional  
> Some global problems require supranational governance.

Abstract  
> Authority should exist at the smallest scale capable of handling the problem.

---

# AXIS 04 — Property and Resource Order

## Definition

How societies should structure ownership and control of resources, land, capital, and production.

## Primary Branches

1. Collective Ownership  
2. Commons Stewardship  
3. Mixed Access Systems  
4. Private Property  
5. Anti-Property / Use-Based Models

## Example Questions

Abstract  
> Private ownership of productive resources is essential for efficient economies.

Institutional  
> Certain critical resources should be managed as commons rather than private property.

Concrete  
> Land and natural resources should sometimes be held in collective trust.

---

# AXIS 05 — Information Order

## Definition

How knowledge, culture, speech, and code should circulate within society.

## Primary Branches

1. Information Control / Censorship  
2. Regulated Openness  
3. Open Knowledge  
4. Radical Information Freedom  
5. Cryptographic Privacy

## Example Questions

Abstract  
> Information should flow freely unless it directly harms others.

Institutional  
> Intellectual property protections are necessary to encourage innovation.

Concrete  
> Governments should have limited authority to regulate online speech.

---

# AXIS 06 — Institutional Stance

## Definition

How individuals relate to existing institutions and systems of governance.

## Primary Branches

1. Loyalty / Institutional Trust  
2. Reform from Within  
3. Institutional Capture  
4. Parallel Institutions  
5. Exit / Secession

## Example Questions

Abstract  
> Political change is usually achieved through gradual reform.

Concrete  
> Building alternative systems outside official institutions can be more effective than reform.

Strategic  
> Communities should develop parallel institutions when state systems fail.

---

# AXIS 07 — Historical Orientation

## Definition

Underlying beliefs about the trajectory of human history.

## Primary Branches

1. Sacred Decline  
2. Civilizational Cycles  
3. Tragic Realism  
4. Pragmatic Evolution  
5. Progressive Emancipation  
6. Teleological Destiny

## Example Questions

Abstract  
> History tends to move through recurring cycles of rise and decline.

Institutional  
> Political systems generally improve over long periods.

Concrete  
> Civilizations often collapse due to internal contradictions.

---

# AXIS 08 — Political Epistemology

## Definition

How political knowledge and truth are believed to emerge.

## Primary Branches

1. Revelation / Sacred Knowledge  
2. Tradition / Inherited Wisdom  
3. Ideological Doctrine  
4. Technocratic Expertise  
5. Empirical Pluralism  
6. Decentralized Discovery

## Example Questions

Abstract  
> Political systems should rely on expert knowledge to guide decision making.

Institutional  
> Tradition and inherited practices often contain valuable political wisdom.

Abstract  
> The best political systems allow knowledge to emerge from decentralized experimentation.

---

# Future Axes (v0.2 candidates)

The following axes may be added in later versions.

- Social Order and Moral Regulation
- Human Nature Assumptions
- Violence and Coercion
- Economic Hierarchy and Inequality

---

# Notes for Implementation

Each question should include metadata:

- axis
- branch weights
- interpretive layer
- abstraction level
- question family

Answers modify the user's ideological field probabilistically rather than producing a single coordinate.

The final visualization renders a **probability cloud within a multidimensional ideological space**.
