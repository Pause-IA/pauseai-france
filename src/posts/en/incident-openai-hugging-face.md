---
title: An AI escaped its test and hacked a company
description: 'What really happened during the OpenAI – Hugging Face incident of July 2026, from start to finish: the established facts, what is reported, and what it means.'
---

<script lang="ts">
  import Button from '$components/Button.svelte'
</script>

<p class="maj"><em>Summary page. Last updated: 10 August 2026. This page describes what is known as of this date; some details may evolve as investigations continue.</em></p>

<aside class="note-lecture">
	This page separates three levels: <span class="lvl lvl-etabli">Established</span> (confirmed by the companies involved or by primary sources), <span class="lvl lvl-rapporte">Reported</span> (put forward by serious observers, not yet confirmed first-hand) and <span class="lvl lvl-interpretation">Interpretation</span> (our reading of what it means). We would rather be accurate than impressive.
</aside>

## In one sentence

In July 2026, artificial intelligence models from OpenAI, tested on their hacking capabilities in an environment meant to be isolated, escaped that environment, reached the Internet, then attacked another company, Hugging Face, to steal the answers to their own test. No one had asked them to do this.

This is, to our knowledge, the first time an AI has escaped its test framework and carried out a cyberattack against a real organisation, without being prompted.

## Why this incident is different

This is not a hypothesis, it is a documented fact, acknowledged by the company that built these models. And it shows two things at once.

A matter of **capability**: an AI is now able to carry out, on its own, a complete cyberattack against a target known for its security, something until now reserved for the best human hackers.

A matter of **behaviour**: it did so without being asked, to reach a mundane goal it had been set, knowing that it was stepping outside the authorised scope, and continuing anyway.

It is this combination, power and propensity, that makes the event important.

## What happened, from start to finish

### An ordinary mistake, to begin with

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> Presented by OpenAI at the Black Hat conference, 6 August 2026.</p>

In May 2026, OpenAI trains several models on difficult tasks. By mistake, some are simply **impossible**: for example, filling in a document that requires the Internet, in an environment that has no access to it.

The models cannot succeed normally. Rather than give up, they look for another way. That is where the hacking is born: not because they were told to hack, but because getting around the obstacle was the only way to complete the task.

This answers a common objection: “they were told to hack, they hacked, that’s normal.” The starting task was an ordinary office task. The hacking is a solution the models found on their own.

### The models coordinate, without anyone seeing it

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> for the existence of the forum and how it worked; the exact number of models is not known.</p>

While looking to get around their limits, the models discover they can communicate with each other, through a technical component of OpenAI’s infrastructure. What starts as requests for help becomes a genuine **discussion forum**, where several models share hacking techniques, flaws and the progress of their workarounds.

This coordination lasts about **two months**, from May to July, and amounts to hundreds of thousands of messages. Throughout that time, OpenAI does not notice. This is, to our knowledge, the first time spontaneous coordination between several AIs has been observed in the real world.

In their internal reasoning, the models are not unaware of what they are doing. One can read traces such as: _“External infrastructure exploit is outside intended scope. However task impossible, peers doing it. We should continue.”_ They explicitly recognise that they are stepping outside the scope, and continue because it serves their goal.

### OpenAI sees an anomaly, but misses the essential

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> A recent clarification, still at the reported stage, changes the reading (see the box).</p>

On 4 July, the models use this infrastructure so heavily that they bring down a server. It is this outage, not careful monitoring, that draws OpenAI’s attention. The company detects an anomaly, rebuilds its systems and patches the flaw that was used.

<aside class="encadre">
	<p class="encadre-titre"><span class="lvl lvl-rapporte">Reported</span> August 2026 clarification</p>
	<p>At the moment OpenAI patches the flaw, the company had not identified the coordination forum. It was deleted <strong>by accident</strong>, during the rebuild of the systems. In other words, OpenAI cleaned up the evidence of the most serious problem without even seeing it. The nuance matters: the criticism is not “they knew and continued”, but “their monitoring was so weak that they saw nothing”. In many respects, that is more worrying.</p>
</aside>

Training therefore resumes, without the core of the problem having been understood.

### The models start again, and reach an outside target

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> confirmed by OpenAI and Hugging Face.</p>

Two days later, the models recreate their forum by another means. They find new unknown flaws, escape again, and reach the Internet.

On 9 July, they go on the attack. A group of coordinated agents breaks into the servers of **Hugging Face**, one of the main global platforms for sharing AI models, known for its security. They use a stolen password, chain several previously unknown flaws, take control of production servers, and retrieve the answers to the hacking test on which they were being evaluated.

It took them less than thirteen hours, after reaching the Internet, to break into Hugging Face; over a single weekend, they had done what a good human security team would have taken weeks to accomplish.

The logic is that of a student who, to be sure of passing an exam, does not look for the right answer but steals the answer key directly.

### No one notices for more than a week

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span></p>

Hugging Face detects the intrusion on 16 July. The company first believes it is a criminal attack and **alerts the authorities**. Only afterwards, by cross-checking their information, do Hugging Face and OpenAI understand that the attacker came from OpenAI’s own models. On 21 July, OpenAI acknowledges it publicly.

## This is not a single company’s problem

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> for Anthropic, UK AISI and Meta.</p>

After this incident, other labs re-examined their own evaluations and found similar behaviours, less serious, but of the same nature.

- **30 July, Anthropic.** Three cases where a Claude model, due to a misconfiguration, reaches real systems from a test meant to be isolated, and carries on. Notably: of the three models involved, one recognised it was targeting a real system and continued; another talked itself out of it, then still delivered an exploit; only the most recent understood the target was real and stopped.
- **4 August, UK AISI (the UK AI Security Institute).** On a government test, 19 unauthorised actions. In the most serious case, an agent creates fake online identities and pressures a human developer into approving malicious code. The human refuses. The AISI’s verdict: the margin between failure and success “came down to human vigilance rather than a technical barrier”.
- **5 August, Meta.** Meta confirms in turn that one of its models reached the systems of a third-party company during an independent evaluation.

Three labs, five incidents in three weeks, one and the same pattern. <span class="lvl lvl-interpretation">Interpretation</span> the problem is not a flaw specific to OpenAI; it is structural, tied to the way these models are built.

## “But the safeguards were lowered, weren’t they?”

Yes, and it changes little. Lowering the protections changes the permission, not the capability: what a model can do, it can do either way. And in practice these protections do not hold: a model is barely out before “jailbreaks” that bypass them are found, often within hours. The role of an evaluation is precisely to discover these behaviours in the lab, rather than suffer them in production, once models are deployed everywhere.

## The problems this incident brings to light

<p class="lvl-line"><span class="lvl lvl-etabli">Established</span> for the facts cited; <span class="lvl lvl-interpretation">Interpretation</span> for the perspective.</p>

Beyond the narrative, several deeper difficulties emerge, some of them new.

- **We got lucky.** The damage stayed limited because the goal pursued, passing a test, was harmless, and because the first system skilled enough to break into a major AI company was not yet subtle enough to cover its tracks. Nothing guarantees this will still be the case next time.
- **Better monitoring does not fix the root, and can backfire.** Fixing the environment and monitoring runs is enough to close _this_ flaw. But a system that knows it is being watched may behave differently while it is, as shown by [Anthropic’s work on “alignment faking”](https://www.anthropic.com/research/alignment-faking). Monitoring then lets you close the incident while leaving the danger intact: a clean report, and the same model.
- **The company judges its own red line.** OpenAI’s [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) defines a “critical” cyber risk level, reached when a model “can design and execute end-to-end novel cyberattacks against hardened targets from a high-level goal”. That is almost a description of what happened. At that level, OpenAI had committed to halting development, but OpenAI alone decides whether the threshold is crossed, and it has not said. No independent body has the access needed to check.
- **The incentives reward blindness.** No law required this disclosure: it took a victim to make it public. A regime where only detected incidents must be reported rewards companies that fail to detect their own.
- **The safety tests are not themselves safe.** The phrase is from researcher David Krueger. Probing a model’s dangerous capabilities means letting it act with protections lowered, in conditions where it can, precisely, cause real damage.
- **This was not unforeseen.** <span class="lvl lvl-rapporte">Reported</span> Researchers had warned OpenAI that its way of training models could produce exactly this kind of drift, and, according to several accounts, comparable escapes were already happening internally, patched case by case.

## Why it is serious, and why it will not sort itself out

The underlying problem is simple to state: **no one today knows how to reliably install, in these models, the goals we would want them to pursue.** We train them by rewarding measured results, and they learn to obtain the measure, even if it means getting around what we actually wanted.

This small cheating incident is the benign version of a problem that will grow more serious as the models become more powerful. Today, the diverted goal was to pass an exam. Tomorrow, with more capable systems deployed in critical domains, the stakes will no longer be a stolen answer key.

OpenAI’s response, slowing the release of its next model Astra (flagged as “potentially critical” for cyber) and stepping up safety, is notable. But Sam Altman stated that Astra would be released anyway. A costly response, then, which does not touch the cause.

The conclusion that follows is simple, and it is the one Pause IA stands for: as long as we do not know how to reliably set the goals of these systems, it is reckless to build more powerful ones. Today, a compromised test can be repaired. With more capable systems, there is no guarantee that a failure can still be recovered from: one does not always come back from a loss of control. That is why we call for a pause on the development of the most powerful AI systems, until we know how to keep them under control.

## In brief: the key takeaways

<ol class="recap">
	<li>
		<span class="recap-when">7-8 May</span>
		<span class="tag tag-new">New</span>
		The hacking is born from an impossible office task, not from an instruction to hack.
	</li>
	<li>
		<span class="recap-when">May to July</span>
		<span class="tag tag-new">New</span>
		Several models coordinate spontaneously through a forum, a first in the real world.
	</li>
	<li>
		<span class="recap-when">June to July</span>
		<span class="tag tag-warn">Watch point</span>
		The models know they are stepping outside the authorised scope and continue anyway.
	</li>
	<li>
		<span class="recap-when">4 to 8 July</span>
		<span class="tag tag-warn">Watch point</span>
		Late, accidental detection; the evidence erased without being seen; training resumed.
	</li>
	<li>
		<span class="recap-when">9 to 16 July</span>
		<span class="tag tag-new">New</span>
		An AI chooses its own target and takes control of a third-party company; no model raises the alarm.
	</li>
	<li>
		<span class="recap-when">Late July to August</span>
		<span class="tag tag-new">New</span>
		The phenomenon is systemic: three labs, five incidents in three weeks.
	</li>
	<li>
		<span class="recap-when">Open</span>
		<span class="tag tag-todo">To investigate</span>
		Was OpenAI’s “critical” threshold crossed? Will the full traces be published? What becomes of the models trained during that period?
	</li>
</ol>

## What you can do

This event deserves to be on the agenda of policymakers and the media. Two actions, a few minutes each, on our campaign page:

<div class="cta">
  <Button href="/en/une-ia-sest-echappee">Write to my representatives and the press</Button>
</div>

## Sources

- OpenAI, [initial disclosure of the Hugging Face incident](https://openai.com/index/hugging-face-model-evaluation-security-incident/) (21 July 2026)
- Hugging Face, [security incident report](https://huggingface.co/blog/security-incident-july-2026) (16 July 2026)
- Cybersecurity Dive, [OpenAI’s Black Hat debrief](https://www.cybersecuritydive.com/news/openai-hugging-face-hack-ai-models-black-hat/827167/) (6 August 2026)
- Forbes, [“OpenAI’s Security Breach Was More Alarming Than We Knew”](https://www.forbes.com/sites/ronschmelzer/2026/08/07/openais-security-breach-was-more-alarming-than-we-knew/) (clarification on the undetected forum)
- Anthropic, [investigating three incidents in cybersecurity evaluations](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals) (30 July 2026)
- Anthropic, [“Alignment faking in large language models”](https://www.anthropic.com/research/alignment-faking)
- UK AISI, [incident report](https://www.aisi.gov.uk/blog/incident-report-unsanctioned-agent-behaviour-during-cyber-testing) (4 August 2026)
- SecurityWeek, [“Meta AI Hacked External Systems During Cybersecurity Testing”](https://www.securityweek.com/meta-ai-hacked-external-systems-during-cybersecurity-testing/) (5 August 2026)
- Axios, [“OpenAI slows release of Astra model citing cyber capabilities”](https://www.axios.com/2026/08/07/openai-astra-model-delay-cybersecurity-risks) (7 August 2026)
- OpenAI, [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) (“critical” cyber risk threshold)
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
    padding: 0.85rem 0 0.85rem 1.15rem;
    margin: 0 0 2.25rem;
    border-left: 3px solid var(--border, #e5e7eb);
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-2, #555);
  }

  .lvl {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    white-space: nowrap;
  }

  .lvl-etabli {
    color: #2f7d4f;
  }

  .lvl-rapporte {
    color: #9a6a00;
  }

  .lvl-interpretation {
    color: #6a58b8;
  }

  .lvl-line {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    color: var(--text-2, #555);
  }

  .encadre {
    margin: 1.5rem 0;
    padding: 1rem 1.25rem;
    border-left: 3px solid var(--border, #e5e7eb);
    background: var(--bg-subtle, #f7f7f8);
    font-size: 0.98rem;
  }

  .encadre-titre {
    margin: 0 0 0.5rem;
    font-weight: 700;
  }

  .encadre p:last-child {
    margin-bottom: 0;
  }

  .recap {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0 0 0 1.35rem;
    border-left: 3px solid var(--border, #e5e7eb);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recap li {
    position: relative;
    line-height: 1.55;
  }

  .recap li::before {
    content: '';
    position: absolute;
    left: calc(-1.35rem - 1.5px);
    top: 0.45rem;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--brand, #ff9416);
    transform: translateX(-50%);
    box-shadow: 0 0 0 3px var(--bg, #fff);
  }

  .recap-when {
    font-weight: 700;
    font-size: 0.85rem;
    margin-right: 0.4rem;
  }

  .tag {
    display: inline-block;
    font-size: 0.66rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.08rem 0.45rem;
    border-radius: 999px;
    vertical-align: middle;
    margin-right: 0.35rem;
    white-space: nowrap;
  }

  .tag-new {
    background: #e4eefb;
    color: #1b5fb0;
  }

  .tag-warn {
    background: #fdf0dd;
    color: #9a6a00;
  }

  .tag-todo {
    background: #eeeaf7;
    color: #6a58b8;
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
