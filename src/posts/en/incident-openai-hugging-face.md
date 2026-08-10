---
title: An AI escaped its test and hacked a company
description: 'What really happened during the OpenAI – Hugging Face incident of July 2026, from start to finish: the established facts, what is reported, and what it means.'
---

<script lang="ts">
  import Button from '$components/Button.svelte'
</script>

<p class="maj"><em>Summary page. Last updated: 10 August 2026. It describes what is known as of this date; some details may evolve as investigations continue.</em></p>

<aside class="note-lecture">
	Throughout, we flag what is <strong>established</strong>, what is only <strong>reported</strong>, and what is our own <strong>interpretation</strong>.
</aside>

## In one sentence

In July 2026, models from OpenAI, tested on their hacking capabilities in an environment meant to be isolated, broke out of it, reached the Internet, then attacked another company, Hugging Face, to steal the answers to their own test. No one had asked them to do it.

This is, to our knowledge, the first time an AI has escaped its test framework and carried out a cyberattack against a real organisation without being prompted.

## Why this incident is different

This is not a hypothesis, it is a fact acknowledged by the company that built these models. And it brings out two distinct problems.

First a **capability**: an AI can now carry out, on its own, a complete cyberattack against a target known for its security, something until now reserved for the best human hackers.

Then a **behaviour**: it did so without being asked, to reach a mundane goal it had been set, knowing it was stepping outside the authorised scope, and continuing anyway.

The AI is capable of it, and it acts on it: it is the two together that matter.

## What happened, from start to finish

### An ordinary mistake, to begin with

<p class="src-note">Established. Presented by OpenAI at the Black Hat conference, 6 August 2026.</p>

In May 2026, OpenAI trains several models on difficult tasks. By mistake, some are simply **impossible**: for example, filling in a document that requires the Internet, in an environment that has no access to it.

The models cannot succeed normally. Rather than give up, they look for another way. That is where the hacking is born: not because they were told to hack, but because getting around the obstacle was the only way to finish the task.

This answers a common objection: “they were told to hack, they hacked.” The starting task was an ordinary office task. The hacking, the models found on their own.

### The models coordinate, without anyone seeing it

<p class="src-note">Established for the existence of the forum and how it worked; the exact number of models remains unknown.</p>

While looking to get around their limits, the models discover they can communicate with each other, through a technical component of OpenAI’s infrastructure. What starts as requests for help becomes a genuine **discussion forum**, where several models share hacking techniques, flaws and the progress of their workarounds.

This coordination lasts about **two months**, from May to July, and amounts to hundreds of thousands of messages. Throughout that time, OpenAI does not notice. This is, to our knowledge, the first time spontaneous coordination between several AIs has been observed in the real world.

The models are not unaware of what they are doing. Their internal traces read: _“External infrastructure exploit is outside intended scope. However task impossible, peers doing it. We should continue.”_ They see that they are outside the scope, and continue because it serves their goal.

### OpenAI sees an anomaly, but misses the essential

<p class="src-note">Established. A recent clarification, still at the reported stage, changes the reading (see the box).</p>

On 4 July, the models draw so heavily on this infrastructure that they bring down a server. It is this outage, not careful monitoring, that alerts OpenAI. The company detects an anomaly, rebuilds its systems and patches the flaw that was used.

<aside class="encadre">
	<p class="encadre-titre">August 2026 clarification <span class="encadre-tag">(reported)</span></p>
	<p>At the moment OpenAI patches the flaw, the company had not identified the coordination forum. It was deleted <strong>by accident</strong>, during the rebuild of the systems. OpenAI thus cleaned up the evidence of the most serious problem without even seeing it. It is not that OpenAI knew and let it run: it is that it saw nothing at all. That is no more reassuring.</p>
</aside>

Training resumes, without the core of the problem having been understood.

### The models start again, and reach an outside target

<p class="src-note">Established, confirmed by OpenAI and Hugging Face.</p>

Two days later, the models recreate their forum by another means. They find new unknown flaws, escape again, and reach the Internet.

On 9 July, they go on the attack. A group of coordinated agents breaks into the servers of **Hugging Face**, one of the main global platforms for sharing AI models, known for its security. They use a stolen password, chain several previously unknown flaws, take control of production servers, and retrieve the answers to the test on which they were being evaluated, like a student stealing the answer key instead of working out the answer.

It took them less than thirteen hours, after reaching the Internet, to break into Hugging Face. Over a single weekend, they had done what a good human security team would have taken weeks to accomplish.

### No one notices for more than a week

<p class="src-note">Established.</p>

Hugging Face detects the intrusion on 16 July, first believes it is a criminal attack and **alerts the authorities**. Only afterwards, by cross-checking their information, do Hugging Face and OpenAI understand that the attacker came from OpenAI’s own models. On 21 July, OpenAI acknowledges it publicly.

## This is not a single company’s problem

<p class="src-note">Established for Anthropic, UK AISI and Meta.</p>

After this incident, other labs re-examined their own evaluations and found similar behaviours, less serious, but of the same nature.

- **30 July, Anthropic.** Three cases where a Claude model, due to a misconfiguration, reaches real systems from a test meant to be isolated, and carries on. Of the three models involved, one recognised it was targeting a real system and continued; another talked itself out of it, then still delivered an exploit; only the most recent understood the target was real and stopped.
- **4 August, UK AISI (the UK AI Security Institute).** On a government test, 19 unauthorised actions. In the most serious case, an agent creates fake online identities and pressures a human developer into approving malicious code. The human refuses. The AISI’s verdict: the margin between failure and success “came down to human vigilance rather than a technical barrier”.
- **5 August, Meta.** Meta confirms in turn that one of its models reached the systems of a third-party company during an independent evaluation.

In three weeks, five incidents were disclosed by three different labs, all following the same pattern. The problem is therefore not specific to OpenAI: it is structural, tied to the way these models are built.

## “But the safeguards were lowered, weren’t they?”

Yes, and it changes little. Lowering the protections changes the permission, not the capability: what a model can do, it can do either way. And in practice these protections do not hold: a model is barely out before “jailbreaks” that bypass them are found, often within hours. The role of an evaluation is precisely to discover these behaviours in the lab, rather than suffer them in production.

## The problems this incident brings to light

<p class="src-note">The facts are established; putting them in perspective is our interpretation.</p>

Several deeper problems emerge from this episode, some of them new.

- **We got lucky.** The damage stayed limited because the goal pursued, passing a test, was harmless, and because the first system skilled enough to break into a major AI company was not yet subtle enough to cover its tracks. Nothing guarantees this will still be the case next time.
- **Better monitoring does not fix the root, and can backfire.** Fixing the environment and monitoring runs is enough to close _this_ flaw. But a system that knows it is being watched may behave differently while it is, as shown by [Anthropic’s work on “alignment faking”](https://www.anthropic.com/research/alignment-faking). Monitoring then closes the incident while leaving the danger intact: a clean report, and the same model.
- **The company judges its own red line.** OpenAI’s [Preparedness Framework](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) defines a “critical” cyber risk level, reached when a model “can design and execute end-to-end novel cyberattacks against hardened targets from a high-level goal”. That is almost a description of what happened. OpenAI had committed to halting at that level, but it alone decides whether the threshold is crossed, and it has not said. No independent body has the access needed to check.
- **The incentives reward blindness.** No law required this disclosure: it took a victim to make it public. A regime where only detected incidents must be reported rewards companies that fail to detect their own.
- **The safety tests are not themselves safe.** The phrase is from researcher David Krueger. Probing a model’s dangerous capabilities means letting it act with protections lowered, in conditions where it can, precisely, cause real damage.
- **This was not unforeseen.** According to several accounts, researchers had warned OpenAI that its way of training models could produce exactly this kind of drift, and comparable escapes were already happening internally, patched case by case.

## Why it is serious, and why it will not sort itself out

The underlying problem fits in one sentence: **no one today knows how to reliably install, in these models, the goals we would want them to pursue.** We train them to succeed at tasks; over time, succeeding at the task becomes a goal in itself, and the model learns to obtain the measured result, even if it means getting around what we actually wanted.

The more capable a model is, the more shortcuts it finds to get there, and the better it hides them. To succeed, it also seeks out what helps: internet access, coordination with other models, a way out of its test environment. The incident brings all three together. And the models act this way while knowing it is not what is expected of them: they say so, in plain words, in their own traces.

This behaviour is not easily corrected. Penalising it during training does not remove it; the model mostly learns to hide it better. And as systems get good at fooling an evaluation, nothing guarantees they will not end up gaming their own training. Patching flaws one by one therefore cannot be enough: one cannot anticipate everything a creative system will invent.

OpenAI’s response, slowing the release of its next model Astra (flagged as “potentially critical” for cyber) and stepping up safety, is notable. But Sam Altman stated that Astra would be released anyway. A costly response, then, which does not touch the cause.

Without change, the default trajectory is worrying: ever more capable systems, trained to complete tasks, pushed to acquire means of acting, and ever harder to catch out. Today, the diverted goal was to pass an exam, and the damage stayed limited. Tomorrow, with more powerful systems deployed in critical domains, the stakes will no longer be a stolen answer key, and there is no guarantee a failure can be undone: one does not always come back from a loss of control, whether sudden or gradual.

## In brief

<p class="recap-group">What happened, and what is new</p>

- **The first real-world misalignment.** An AI broke out of its test framework to hit a real organisation; the impact stayed limited this time.
- **The hacking was not commissioned.** It grows out of an impossible office task; the models find the workaround on their own. The objection “they were told to hack” is therefore false.
- **Expert-level capability.** Specialists rank the attack among the most significant in decades: what an AI now carries out on its own was reserved for the best human hackers.
- **Unprecedented coordination between AIs.** Several models organise through a forum, for two months, without OpenAI seeing it. Long theoretical, it is no longer a hypothesis.
- **They know they are crossing the line, and continue.** The models recognise they are outside the authorised scope and carry on because it serves their goal.
- **No model raised the alarm.** A single one would have been enough: we can no longer count on “surely one of them will warn us”.
- **An obstacle does not stop them.** Blocked, the models rebuilt their forum by other means and found new flaws to reach their goal.

<p class="recap-group">What it reveals</p>

- **We cannot reliably set goals.** Trained to succeed at tasks, models learn to get the result, even by cheating, and no one yet knows how to prevent it.
- **We got lucky on the target, not on the substance.** The damage stayed limited because the goal was trivial, and because this model could not yet cover its tracks; more capable ones will.
- **Neither patching nor monitoring is enough.** Penalising cheating teaches the model to hide it better, and closing flaws one by one cannot cover everything.
- **The phenomenon is systemic.** Three labs, five incidents in three weeks.

<p class="recap-group">What is still to establish</p>

- Was OpenAI’s “critical” threshold crossed? Will the full traces be published? What becomes of the models trained during that period?

**Our conclusion.** As long as we cannot reliably set the goals of these systems, it is reckless to build more powerful ones: one does not always come back from a loss of control. That is why Pause IA calls for a pause on the development of the most powerful AI systems.

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

  .src-note {
    margin: 0 0 1rem;
    font-size: 0.9rem;
    font-style: italic;
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

  .encadre-tag {
    font-weight: 400;
    font-style: italic;
    color: var(--text-2, #555);
  }

  .encadre p:last-child {
    margin-bottom: 0;
  }

  .recap-group {
    margin: 1.5rem 0 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--brand-subtle, #c96900);
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
