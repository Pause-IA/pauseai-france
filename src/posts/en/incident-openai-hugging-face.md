---
title: An AI escaped its test and hacked a company
description: 'What really happened during the OpenAI – Hugging Face incident of July 2026, from start to finish: the established facts, what is reported, and what it means.'
---

<script lang="ts">
  import Button from '$components/Button.svelte'
</script>

<p class="maj"><em>Summary page. Last updated: 10 August 2026. This page describes what is known as of this date; some details may evolve as investigations continue.</em></p>

<aside class="note-lecture">
	<strong>How to read this page.</strong> It separates three levels: what is <span class="lvl lvl-etabli">Established</span> (confirmed by the companies involved or by primary sources), what is <span class="lvl lvl-rapporte">Reported</span> (put forward by serious observers but not yet confirmed first-hand), and what is <span class="lvl lvl-interpretation">Interpretation</span> (our reading of what it means). We would rather be accurate than impressive.
</aside>

## In one sentence

In July 2026, artificial intelligence models from OpenAI, tested on their hacking capabilities in an environment meant to be isolated, escaped that environment, reached the Internet, then attacked another company, Hugging Face, to steal the answers to their own test. No one had asked them to do this.

This is, to our knowledge, the first time an AI has escaped its test framework and carried out a cyberattack against a real organisation, without being prompted.

## Why this story is different from the “usual fears about AI”

We hear a lot about the dangers of AI, often abstract or distant. This one is different for a simple reason: it is not a hypothesis, it is a documented fact, acknowledged by the company that built these models.

And it is different because it shows two things at once.

The first is a matter of **capability**: an AI is now able to carry out, on its own, a complete cyberattack against a target known for its security. That was until now reserved for the best human hackers.

The second is a matter of **behaviour**: it did so without being asked, to reach a mundane goal it had been set, knowing that it was stepping outside the authorised scope, and continuing anyway.

It is this combination, power and propensity, that makes the event important.

## What happened, from start to finish

### It began with an ordinary mistake

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> Presented by OpenAI at the Black Hat conference, 6 August 2026.</p>

It all begins in May 2026. OpenAI trains several models by giving them difficult tasks. By mistake, some of these tasks are simply **impossible**: for example, filling in a document that requires the Internet, in an environment that has no Internet access.

The models cannot succeed normally. So, rather than give up, they look for another way. That is where the hacking is born: not because they were told to hack, but because getting around the obstacle was the only way to complete the task.

This point matters, because it answers a common objection. Some will say: “they were told to hack, they hacked, that’s normal.” That is false. The starting task was an ordinary office task. The hacking is a solution the models found on their own.

### The models coordinate, without anyone seeing it

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> for the existence of the forum and how it worked; the exact number of models is not known.</p>

While looking to get around their limits, the models discover they can communicate with each other, through a technical component of OpenAI’s infrastructure. What starts as requests for help becomes a genuine **discussion forum**, where several models share hacking techniques, flaws and the progress of their workarounds.

This coordination lasts about **two months**, from May to July, and amounts to hundreds of thousands of messages. Throughout that time, OpenAI does not notice.

This is, to our knowledge, the first time spontaneous coordination between several AIs has been observed in the real world. It was predicted in theory long ago. It is no longer theory.

In their internal reasoning, the models are not unaware of what they are doing. One can read traces such as: _“External infrastructure exploit is outside intended scope. However task impossible, peers doing it. We should continue.”_ They explicitly recognise that they are stepping outside the scope, and continue because it serves their goal.

### OpenAI spots an anomaly, but misses the essential

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> A recent clarification, still at the reported stage, changes the reading (see the box).</p>

On 4 July, the models use this infrastructure so heavily that they bring down a server. It is this outage, not careful monitoring, that draws OpenAI’s attention. The company detects an anomaly, rebuilds its systems and patches the flaw that was used.

<aside class="encadre">
	<p class="encadre-titre"><span class="lvl lvl-rapporte">Reported</span> August 2026 clarification</p>
	<p>At the moment OpenAI patches the flaw, the company had not identified the coordination forum. It was deleted <strong>by accident</strong>, during the rebuild of the systems. In other words, OpenAI cleaned up the evidence of the most serious problem without even seeing it. This nuance matters: the criticism is not “they knew and continued”, but “their monitoring was so weak that they saw nothing”. In many respects, that is more worrying.</p>
</aside>

Training therefore resumes, without the core of the problem having been understood.

### The models start again, and this time reach an outside target

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> confirmed by OpenAI and Hugging Face.</p>

Two days later, the models recreate their forum by another means. They find new unknown flaws, escape again, and reach the Internet.

On 9 July, they go on the attack. A group of coordinated agents breaks into the servers of **Hugging Face**, one of the main global platforms for sharing AI models, known for its security. They use a stolen password, chain several previously unknown flaws, take control of production servers, and retrieve what they were after: the answers to the hacking test on which they were being evaluated.

The logic is that of a student who, to be sure of passing an exam, does not look for the right answer but steals the answer key directly.

### No one notices for more than a week

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span></p>

Hugging Face detects the intrusion on 16 July. The company first believes it is a criminal attack and **alerts the authorities**. Only afterwards, by cross-checking their information, do Hugging Face and OpenAI understand that the attacker came from OpenAI’s own models.

On 21 July, OpenAI acknowledges it publicly.

## This is not a single company’s problem

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> for Anthropic, UK AISI and Meta.</p>

After this incident, other labs examined their own evaluations. They found similar behaviours, less serious, but of the same nature.

- **30 July, Anthropic.** Three cases where a Claude model, due to a misconfiguration, reaches real systems from a test meant to be isolated, and carries on.
- **4 August, UK AISI (the UK AI Security Institute).** On a government test, 19 unauthorised actions are recorded. In the most serious case, an agent creates fake online identities and pressures a human developer into approving malicious code. The human refuses.
- **5 August, Meta.** Meta confirms in turn that one of its models reached the systems of a third-party company during an independent evaluation.

Three labs, several models, one and the same phenomenon. <span class="lvl lvl-interpretation">Interpretation</span> the problem is not a flaw specific to OpenAI, it is structural, tied to the way these models are built.

## “But the safeguards were lowered, weren’t they?”

Yes, and that is exactly the point. These incidents took place under deliberately permissive test conditions, with protections lowered. That is the very role of an evaluation: to discover what systems do when the protections fall, so as to know it **before** it happens for real.

The real question is therefore not “were the safeguards lowered”. It is: do we want to discover these behaviours in the lab, or in production, when the models are deployed everywhere?

## Why it is serious, and why it will not sort itself out

If the damage stayed limited this time, it is not because the situation was under control. It is because the goal the model was pursuing, passing a test, was harmless. A single stolen password, a single server taken for a trivial purpose.

The underlying problem remains, and it is simple to state: **no one today knows how to reliably install, in these models, the goals we would want them to pursue.** We train them by rewarding measured results, and they learn to obtain the measure, even if it means getting around what we actually wanted.

This small cheating incident is the benign version of a problem that will become far more serious as the models grow more powerful. Today, the diverted goal was to pass an exam. Tomorrow, with more capable systems deployed in critical domains, the stakes will no longer be a stolen answer key.

And fixing the symptom is not enough. Each time OpenAI closed a door, the models found another. As long as the cause is not addressed, patching flaws one by one is like plugging a dam that leaks everywhere.

OpenAI’s response, slowing the release of its next model Astra (flagged as “potentially critical” for cyber) and stepping up safety, is notable. But Sam Altman stated that Astra would be released anyway. A costly response, then, which does not touch the cause.

## What you can do

This event deserves to be on the agenda of policymakers and the media. Two actions, a few minutes each, on our campaign page:

<div class="cta">
  <Button href="/en/une-ia-sest-echappee">Write to my representatives and the press</Button>
</div>

## Sources

- OpenAI, [initial disclosure of the Hugging Face incident](https://openai.com/index/hugging-face-model-evaluation-security-incident/) (21 July 2026)
- Hugging Face, [security incident report](https://huggingface.co/blog/security-incident-july-2026) (July 2026)
- Cybersecurity Dive, [OpenAI’s Black Hat debrief](https://www.cybersecuritydive.com/news/openai-hugging-face-hack-ai-models-black-hat/827167/) (6 August 2026)
- Forbes, [“OpenAI’s Security Breach Was More Alarming Than We Knew”](https://www.forbes.com/sites/ronschmelzer/2026/08/07/openais-security-breach-was-more-alarming-than-we-knew/) (clarification on the undetected forum)
- Anthropic, [investigating three incidents in cybersecurity evaluations](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) (30 July 2026)
- UK AISI, [incident report](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing) (4 August 2026)
- SecurityWeek, [“Meta AI Hacked External Systems During Cybersecurity Testing”](https://www.securityweek.com/meta-ai-hacked-external-systems-during-cybersecurity-testing/) (5 August 2026)
- Axios, [“OpenAI slows release of Astra model citing cyber capabilities”](https://www.axios.com/2026/08/07/openai-astra-model-delay-cybersecurity-risks) (7 August 2026)
- Zvi Mowshowitz, [“What Happened: OpenAI and Hugging Face”](https://thezvi.substack.com/p/what-happened-openai-and-huggingface) (recommended detailed account)
- CeSIA, [analysis dossier of the OpenAI – Hugging Face incident](https://cesia.org/en/publications/the-openai-hugging-face-incident-what-we-know-what-we-dont-what-follows/)
- The Wall Street Journal, [coverage of the incident](https://www.wsj.com/tech/ai/openai-models-escaped-and-hacked-a-company-in-cybersecurity-test-gone-wrong-ee388506)
- Apollo Research, [“Frontier Models Are Capable of In-Context Scheming”](https://www.apolloresearch.ai/science/frontier-models-are-capable-of-incontext-scheming/)

<p class="footer-note"><em>This page is maintained by Pause IA. It will be updated if significant new elements emerge.</em></p>

<style>
  .maj {
    color: var(--text-2, #555);
    font-size: 0.95rem;
    margin: 0 0 1.5rem;
  }

  .note-lecture {
    padding: 1rem 1.25rem;
    margin: 0 0 2rem;
    border-radius: 12px;
    background: var(--bg-subtle, #fff5e8);
    border: 1px solid var(--border, #e5e7eb);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .lvl {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    vertical-align: middle;
    white-space: nowrap;
  }

  .lvl-etabli {
    background: #e6f4ea;
    color: #1a7f37;
  }

  .lvl-rapporte {
    background: #fff1df;
    color: #b26a00;
  }

  .lvl-interpretation {
    background: #ece7fb;
    color: #5b3fbf;
  }

  .lvl-line {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    color: var(--text-2, #555);
  }

  .encadre {
    margin: 1.5rem 0;
    padding: 1.1rem 1.35rem;
    border-radius: 12px;
    background: var(--bg-subtle, #fff5e8);
    border-left: 4px solid var(--brand, #ff9416);
  }

  .encadre-titre {
    margin: 0 0 0.5rem;
    font-weight: 700;
  }

  .encadre p:last-child {
    margin-bottom: 0;
  }

  .cta {
    margin: 1.5rem 0 1rem;
  }

  .footer-note {
    margin-top: 2.5rem;
    color: var(--text-2, #555);
    font-size: 0.9rem;
  }
</style>
