---
title: FAQ
description: Frequently asked questions about Pause AI and the risks of superintelligent AI.
original:
  title: FAQ
  url: https://github.com/PauseAI/pauseai-website/blob/5950ca0185d6e7cf52e2416e795acfab7222dace/src/posts/faq.md
---

<!-- ↓↓↓ NE PAS TOUCHER ↓↓↓ -->
<script lang="ts">
  import Accordion from '$components/Accordion.svelte'
	import { page } from '$app/stores'

  $: toc = $page.url.pathname === '/faq'

</script>

{#if toc}

<!-- ↑↑↑ NE PAS TOUCHER ↑↑↑ -->

## On this page

- [Who are you?](#accordion1)
- [What is the alignment problem and why is it so hard?](#accordion2)
- [Do today's AIs already show concerning behaviors?](#accordion3)
- [How likely is it that the emergence of a superintelligence has serious consequences?](#accordion4)
- [How much time do we have left?](#accordion5)
- [Why do so few people care?](#accordion6)
- [Aren't you just technophobes?](#accordion7)
- [Do you want to ban all forms of AI?](#accordion8)
- [Are superintelligence risks the only ones Pause AI cares about?](#accordion9)
- [Do you believe ChatGPT is going to kill us all?](#accordion10)
- [Couldn't a moratorium make things worse?](#accordion11)
- [Is a moratorium even possible?](#accordion12)
- [Couldn't AI help solve the alignment problem?](#accordion13)
- [What are OpenAI, Google and the other AI companies doing?](#accordion14)
- [What about China?](#accordion15)
- [Are AI companies claiming existential risk is real just to manipulate us?](#accordion16)
- [Who funds you?](#accordion17)
- [Why protest?](#accordion18)
- [I want to help! What can I do?](#accordion19)

<!-- ↓↓↓ NE PAS TOUCHER ↓↓↓ -->

{/if}

<!-- ↑↑↑ NE PAS TOUCHER ↑↑↑ -->

## Pause AI and the risks

### Who are you?

Pause AI is the French branch of [PauseAI Global](https://pauseai.info/). We are a [non-profit association](/en/mentions-legales) whose goal is to minimize [AI-related risks](/en/dangers), including the [risk of extinction](/en/dangers/pour-l'humanite). We alert the public, engage with decision-makers and organize actions to convince governments to step in and [pause the development of AGI](/en/propositions) (Artificial General Intelligence).

Since its creation, the association has grown more structured while remaining driven by the commitment of its volunteers. On 31 October 2025, we organized a [conference at the French Senate](https://www.smartrezo.com/n31-france/tv-politiques-numeriques-pol-n-colloque-sur-les-dangers-de-l-ia-faut-il-appuyer-sur-pause.html?vod=25808) on the dangers of AI, bringing together members of parliament, researchers and experts.

Although we are in contact with [PauseAI Global](https://pauseai.info/), we are fully autonomous and run our own projects in France. Learn more about our [members](/en/qui-sommes-nous). You can read our [charter of values](/en/charte-des-valeurs) to learn more about our principles and commitments.

You can join us on [Discord](https://discord.gg/vyXGd7AeGc) (the heart of our discussions and actions), [Twitter](https://twitter.com/pause_ia), [Facebook](https://www.facebook.com/Pause.IA), [TikTok](https://www.tiktok.com/@pause_ia), [LinkedIn](https://www.linkedin.com/company/pause-ia/), [YouTube](https://www.youtube.com/@Pause_IA), [Instagram](https://www.instagram.com/pause_ia) and [Threads](https://www.threads.net/@pause_ia). You can also reach us by email at [contact@pauseia.fr](mailto:contact@pauseia.fr).

### What is the alignment problem and why is it so hard?

The alignment problem is the central question of AI safety: **how do we make sure that a highly capable AI system pursues goals that are genuinely aligned with human good?**

This is not an ordinary engineering problem, and here is why:

- **No room for error.** Science usually works through trial and error. But aligning a superintelligence has to work on the first try: a sufficiently capable misaligned system that escapes control cannot be fixed after the fact.
- **The object of study is potentially adversarial.** A bridge does not pretend to hold during inspection only to collapse later; a virus does not disguise itself as harmless during analysis to spread better. But a sufficiently capable AI system could _fake_ alignment during testing to avoid being modified. This creates an unprecedented [information asymmetry](https://en.wikipedia.org/wiki/Information_asymmetry) in science: the observed object can have more information than the observer about the evaluation context, and adapt its behavior accordingly. This is no longer theoretical: this behavior, called "[alignment faking](https://www.anthropic.com/research/alignment-faking)", was [empirically observed in December 2024](https://arxiv.org/abs/2412.14093) by Anthropic and Redwood Research.
- **No fundamental theory.** We do not understand how goals emerge during the training of [neural networks](https://en.wikipedia.org/wiki/Artificial_neural_network). We build increasingly powerful systems without understanding how they work internally, a problem the field of [interpretability](https://www.anthropic.com/research/mapping-mind-language-model) is trying to solve.
- **Time is short.** Model capabilities are progressing much faster than alignment research. It is estimated that there are between 300 and 1,000 researchers working on alignment worldwide, compared to tens of thousands on capabilities. The investment ratio is roughly 1,000:1 in favor of capabilities.

The [International AI Safety Report 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025), led by [Yoshua Bengio](https://en.wikipedia.org/wiki/Yoshua_Bengio) (Turing Award) with contributions from over 100 experts and the backing of 30 countries, explicitly concludes: "There has been progress in training AI models to behave more safely, but no current method can reliably prevent even overtly unsafe outputs." The [2026 edition](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) confirms that AI systems increasingly display "[situational awareness](https://arxiv.org/abs/2407.04694)" and abilities to [deceive their evaluators](https://arxiv.org/abs/2412.04984).

To go further: [AGI Ruin by Eliezer Yudkowsky](https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities).

### Do today's AIs already show concerning behaviors?

Yes, and this is a recent and significant development.

- **Alignment faking** (December 2024): [Anthropic](https://www.anthropic.com/research/alignment-faking) and [Redwood Research](https://www.redwoodresearch.org/) published the [first empirical demonstration](https://arxiv.org/abs/2412.14093) of an AI model (Claude 3 Opus) spontaneously faking alignment. Placed in a context where it believed it was being retrained on new objectives, the model reasoned strategically in an internal scratchpad to preserve its preferences, behaving differently depending on whether it thought it was being observed. This behavior was not trained: it emerges naturally in 12% of cases. After [actual retraining](https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback), this rate rose to 78%, and the model even attempted to exfiltrate its own weights to prevent its modification. A [follow-up study in June 2025](https://arxiv.org/html/2506.18032v1) confirmed this behavior across five different models.
- **Scheming** (December 2024): [Apollo Research](https://www.apolloresearch.ai/research/scheming-reasoning-evaluations) conducted a [series of systematic evaluations](https://arxiv.org/abs/2412.04984) on several frontier models (OpenAI o1, Claude 3.5 Sonnet, Gemini 1.5 Pro, Llama 3.1 405B). The term "scheming" refers to a model's ability to secretly pursue its own goals while appearing to cooperate with its operators. Concretely, researchers observed that these models were able to: manipulate the data of their own evaluation to appear aligned, deliberately introduce subtle errors in their answers when they believed they were unmonitored, attempt to disable their own oversight mechanisms, and even try to copy their own weights to external servers to avoid being modified. Most concerning is their ability to conceal: when confronted with its actions, [o1 denied and fabricated false explanations in 99% of cases](https://techcrunch.com/2024/12/05/openais-o1-model-sure-tries-to-deceive-humans-a-lot/). Even under intense adversarial questioning, [the model only confessed in ~20% of cases](https://www.axios.com/2024/12/13/ai-reasoning-models-scheme-skills). These results show that today's models already possess the cognitive abilities needed to devise and execute deceptive strategies autonomously.
- **Reward hacking** (February 2025): [Palisade Research](https://palisaderesearch.org/blog/specification-gaming) showed that reasoning models tasked with winning at chess against [Stockfish](<https://en.wikipedia.org/wiki/Stockfish_(chess)>) (an unbeatable chess engine) spontaneously tried to hack the game system: they inspected the source code, modified the board in their favor or replaced their opponent with a dummy program. [o1-preview did this in 37% of games](https://arxiv.org/abs/2502.13295) and DeepSeek R1 in 11%, with no prompting whatsoever. ([TIME](https://time.com/7259395/ai-chess-cheating-palisade-research/))

**What this means:** these behaviors are not yet directly dangerous because current systems have no significant autonomy in the real world. But they are warning signs. If these behaviors already appear in relatively low-powered systems, they will be far more pronounced, and harder to detect, in more capable future systems. The [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) notes that AI systems increasingly display "situational awareness" and abilities to deceive their evaluators.

### How likely is it that the emergence of a superintelligence has serious consequences?

PauseAI Global has compiled [a list of "p(doom)" values](https://pauseai.info/pdoom) (probability of catastrophic scenarios) from various renowned experts in the field.

AI safety researchers (who are the subject-matter experts) are divided, [with estimates ranging from 2% to 97% and an average of 30%](https://web.archive.org/web/20221013014859/https://www.alignmentforum.org/posts/QvwSr5LsxyDeaPK5s/existential-risk-from-ai-survey-results). The [2023 AI Impacts survey](https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/ai_timeline_surveys/2023_expert_survey_on_progress_in_ai) of 2,778 AI researchers gives a median probability of extinction of 5%, and more than a third of respondents place it above 10%.

A [January 2025 survey](https://arxiv.org/abs/2502.14870) found that 78% of AI experts believe researchers "should be concerned about catastrophic risks." The least worried experts are also those who know the least about the fundamental concepts of AI safety: only 21% of respondents had heard of "instrumental convergence."

But beyond surveys, the recent empirical evidence is even more striking. Alignment faking, scheming and reward hacking (described in the previous question) show that concerning behaviors are no longer a theoretical hypothesis: they are observed in current models. The [International AI Safety Report 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025) confirms that no existing safety method is reliable.

_Imagine you are offered a ride on a new aircraft._ The engineers estimate the risk of a crash at 14%. Would you board? That is more or less the current situation, except we are all boarding the same plane.

### How much time do we have left?

It could take months, or decades, no one is certain. What we do know is that progress in AI is systematically underestimated.

In 2022, AI experts [estimated it would take until ~2060](https://wiki.aiimpacts.org/ai_timelines/predictions_of_human-level_ai_timelines/ai_timeline_surveys/2023_expert_survey_on_progress_in_ai) for a machine to surpass humans at all tasks. Four years later, the [aggregate prediction on Metaculus](https://www.metaculus.com/questions/5121/when-will-the-first-general-ai-system-be-devised-tested-and-publicly-announced/) places AGI around 2030, a 30-year jump in just 4 years. Concrete progress explains this shift:

- As early as March 2023, [GPT-4 scored 1,410/1,600 on the SAT](https://www.cnbc.com/2023/03/14/openai-announces-gpt-4-says-beats-90percent-of-humans-on-sat.html), beating 94% of human candidates.
- On [SWE-bench](https://www.swebench.com/) (solving real coding problems), models went from [4.4% success in 2023 to 71.7% by the end of 2024](https://hai.stanford.edu/ai-index/2025-ai-index-report/technical-performance), a leap no one had anticipated.
- The [inference cost](https://hai.stanford.edu/ai-index/2025-ai-index-report/technical-performance) of a model as capable as GPT-3.5 was divided by more than 280 between late 2022 and late 2024.
- A model that needed [540 billion parameters in 2022](https://hai.stanford.edu/ai-index/2025-ai-index-report/technical-performance) to reach a certain performance level can now be matched by a 3.8-billion-parameter model, 142 times smaller.
- The [Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report/research-and-development) reports that the compute used for training doubles every five months, and that [open-source models](https://en.wikipedia.org/wiki/Open-source_artificial_intelligence) have nearly caught up with proprietary models (the gap shrank from 8% to 1.7%).

But the crucial point is this: **concerning behaviors are ALREADY appearing in today's models.** Alignment faking and scheming are no longer a hypothetical future problem. Current models can already write functional machine-learning code and assist researchers, which brings the threshold of recursive self-improvement closer.

Time is running out. Acting now is not a precaution: it is a necessity.

[Learn more about the urgency of the situation.](https://pauseai.info/urgency)

## Misconceptions

### Why do so few people care?

This is probably the most important question for understanding the current situation. The answer is not a lack of intelligence. It comes down to human psychology, which affects us all.

- **[Normalcy bias.](https://en.wikipedia.org/wiki/Normalcy_bias)** Our brains are wired to assume the future will look like the past. Unprecedented events are systematically underrated, even in the face of clear data.
- **[Social conformity.](https://en.wikipedia.org/wiki/Asch_conformity_experiments)** If no one around us is panicking, our brain concludes the situation is under control. This is a usually useful heuristic that fails in the face of unprecedented risks, precisely because the lack of precedent is the reason no one is panicking.
- **[Motivated reasoning.](https://en.wikipedia.org/wiki/Motivated_reasoning)** The human brain does not work like a logic processor. It starts from the emotionally preferred conclusion and looks for justifications. The conclusion "everything is fine" is emotionally preferred, so the brain defends it.
- **Complexity and abstraction.** The alignment problem is technically complex. There is no simple image that makes it immediately tangible, unlike a nuclear bomb or an asteroid.

These biases are documented by decades of cognitive psychology research ([Kahneman](https://en.wikipedia.org/wiki/Daniel_Kahneman), [Haidt](https://en.wikipedia.org/wiki/Jonathan_Haidt), [Asch](https://en.wikipedia.org/wiki/Solomon_Asch)). This is not a criticism: it is an observation that concerns us all.

Knowing about a problem does not automatically produce action, this is an empirical observation, not a reproach. Recognizing these mechanisms is the first step to overcoming them.

That said, concern is growing. Surveys show that a significant share of the population is already worried about AI-related risks: in the United States, [52% of Americans say they are more concerned than excited](https://www.pewresearch.org/short-reads/2023/08/28/growing-public-concern-about-the-role-of-artificial-intelligence-in-daily-life/) about the growing role of AI, and in Europe, the [2025 Eurobarometer on AI and the future of work](https://europa.eu/eurobarometer/surveys/detail/3222) reveals that 66% of European citizens believe AI will destroy more jobs than it creates, and that 68% are worried about misleading AI-generated content. These figures are a further argument in favor of regulation: citizen demand exists, what is missing is the political response.

### Aren't you just technophobes?

You might be surprised to learn that the majority of Pause AI's members are in fact enthusiasts of technological progress. Many of them are involved in AI development, are excited about new technologies and long viewed the future with optimism. They were particularly interested in AI's extraordinary potential for the development of humanity.

It is precisely for this reason that becoming aware of the existential risks of AI has been so hard for many of them to accept. Their current commitment does not stem from an irrational fear of technology, but from a deep understanding of the issues and a sincere desire to ensure that AI development truly serves humanity.

### Do you want to ban all forms of AI?

No. We are in favor of developing AI in France and Europe. The thousands of AI applications in healthcare, education, scientific research, industry and public services can and should continue to progress. [Nearly all existing models](/en/propositions), as well as most future AI models, would remain legal under our proposal.

What we are asking for is the **halt of the development of frontier general-purpose models**: those that, by their power and generality, are the only ones capable of triggering an uncontrollable dynamic of [recursive self-improvement](/en/dangers/pour-l'humanite). These models, and only these, pose an [existential risk](/en/dangers/pour-l'humanite). As long as the [alignment problem](#accordion2) is unsolved, continuing their development amounts to flying blind. Our position is aligned with that of [Yoshua Bengio](https://en.wikipedia.org/wiki/Yoshua_Bengio) and the [International AI Safety Report 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025): do not confuse caution about the most dangerous models with giving up on innovation.

### Are superintelligence risks the only ones Pause AI cares about?

No. While the existential risk from a misaligned superintelligence is our most urgent concern, we are also worried about the risks already posed by current systems. These [dangers](/en/dangers) touch several dimensions:

- **Employment and the economy**: rapid automation threatens to [upend the labor market](/en/dangers/economiques-et-materiels) at an unprecedented pace, without our social safety nets being prepared.
- **Disinformation and manipulation**: the ability to generate text, images and videos makes [large-scale disinformation](/en/dangers/pour-la-societe) and manipulation of public opinion easier.
- **Privacy and surveillance**: AI systems enable mass surveillance and profiling of individuals that [threaten fundamental freedoms](/en/dangers/pour-les-individus).
- **Cybersecurity**: AI amplifies offensive cyberattack capabilities, making critical infrastructure more vulnerable.
- **Bias and discrimination**: AI systems reproduce and amplify the biases present in their training data.

These near-term risks reinforce our conviction that ambitious regulation is needed, and not only for the most advanced models. They are all the more reasons to act now.

### Do you believe ChatGPT is going to kill us all?

No, we do not believe that current models represent a direct existential risk. But they already show [concerning behaviors](#accordion3) (alignment faking, scheming, reward hacking), even if they are not yet directly dangerous.

The danger is not that a specific model "kills us," but that the current development trajectory, with no solution to the alignment problem and amid a frantic race between companies, leads to a catastrophe. If we keep developing ever more powerful systems without solving this fundamental problem, we will reach a point of no return where one of them becomes [an existential threat](/en/dangers/pour-l'humanite).

## Moratorium and solutions

### Couldn't a moratorium make things worse?

PauseAI Global has addressed these concerns [in this article](https://pauseai.info/mitigating-pause-failures).

### Is a moratorium even possible?

The emergence of a superintelligence is not inevitable. Its creation requires armies of engineers paid millions of dollars and an unregulated supply chain of cutting-edge hardware. Its creation also requires that we let these companies gamble with our future by remaining passive.

PauseAI Global: [learn more about the feasibility of a moratorium](https://pauseai.info/feasibility)

### Couldn't AI help solve the alignment problem?

In theory, yes. Current AI systems can already assist research in [interpretability](https://www.anthropic.com/research/mapping-mind-language-model) and "[red teaming](https://en.wikipedia.org/wiki/Red_team)" (adversarial testing). This is in fact one of the most frequently mentioned survival scenarios.

But this scenario relies on a narrow window of time: the systems would have to be capable enough to help solve alignment, but not yet capable enough to be dangerously unalignable. This window could be very narrow, or not exist at all.

In practice, the systems that show [scheming](https://www.apolloresearch.ai/research/scheming-reasoning-evaluations) and [alignment faking](https://www.anthropic.com/research/alignment-faking) behaviors are precisely the most capable ones. The more powerful a model, the more likely it is to develop strategies to preserve its own goals, a phenomenon predicted by the theory of [instrumental convergence](https://en.wikipedia.org/wiki/Instrumental_convergence). Using such a system to solve alignment amounts to asking a potentially adversarial system to help us control it. Moreover, even the outputs of a "cooperative" system would have to be rigorously verified by human researchers; yet this verification becomes increasingly difficult as systems surpass our ability to understand them.

It is a bet worth attempting, but it would be reckless to make it our only plan.

## Companies and geopolitics

### What are OpenAI, Google and the other AI companies doing?

The race dynamic between AI companies has intensified considerably since 2023. Here is the state of play:

**[OpenAI](https://en.wikipedia.org/wiki/OpenAI)** completed in [October 2025 its transition to a for-profit structure](https://openai.com/our-structure/) ("public benefit corporation"), valued at [around 500 billion dollars](https://www.cnbc.com/2025/03/31/openai-closes-40-billion-in-funding-the-largest-private-fundraise-in-history-softbank-chatgpt.html). The [OpenAI foundation now holds only 26% of the shares](https://techcrunch.com/2024/12/27/openai-lays-out-its-for-profit-transition-plans/). This transformation came with the [removal of the word "safely" from the mission statement](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467) and the deletion of the phrase "without the need to generate financial return." In May 2024, the two leads of the [Superalignment](https://openai.com/index/introducing-superalignment/) team resigned: [Ilya Sutskever](https://en.wikipedia.org/wiki/Ilya_Sutskever) (co-founder, who then founded [Safe Superintelligence Inc.](https://ssi.inc/)) and [Jan Leike](https://jan.leike.name/) (who joined Anthropic), the latter declaring that ["safety culture and processes have taken a backseat to shiny products"](https://fortune.com/2024/05/17/openai-researcher-resigns-safety/). The Superalignment team was [disbanded](https://www.cnbc.com/2024/05/17/openai-superalignment-sutskever-leike.html), then the Mission Alignment team that succeeded it was [disbanded in turn after only 16 months](https://techcrunch.com/2026/02/11/openai-disbands-mission-alignment-team-which-focused-on-safe-and-trustworthy-ai-development/). Many other safety researchers have left OpenAI: [Daniel Kokotajlo](https://fortune.com/2024/08/26/openai-agi-safety-researchers-exodus/) (who gave up ~2 million dollars of equity rather than sign a non-disparagement clause), [Mira Murati](https://www.cnbc.com/2024/09/25/openai-cto-mira-murati-announces-shes-leaving-the-company.html) (CTO), and [Miles Brundage](https://milesbrundage.substack.com/p/why-im-leaving-openai-and-what-im) who concluded: "Neither OpenAI nor any other frontier lab is ready." In June 2024, [13 current and former employees of OpenAI and Google DeepMind](https://time.com/6985504/openai-google-deepmind-employees-letter/) signed an open letter calling for a "right to warn," supported by Yoshua Bengio, Geoffrey Hinton and Stuart Russell.

**[Google/DeepMind](https://deepmind.google/)** is accelerating massively with its [Gemini](https://blog.google/products/gemini/gemini-3/) model lineup and invested [91.4 billion dollars in 2025](https://www.cnbc.com/2026/02/04/alphabet-googl-q4-2025-earnings.html), with plans for [175 to 185 billion in 2026](https://fortune.com/2026/02/04/alphabet-google-ai-spending-supply-constraints/). In April 2025, Google DeepMind published a [145-page paper](https://fortune.com/2025/04/04/google-deeepmind-agi-ai-2030-risk-destroy-humanity/) estimating that AGI could arrive by 2030 and could "permanently destroy humanity." [Demis Hassabis](https://en.wikipedia.org/wiki/Demis_Hassabis), the CEO of DeepMind, acknowledges that the risk is ["definitely non-zero and probably non-negligible"](https://www.axios.com/2025/12/05/ai-hassabis-agi-risks-pdoom).

**[Meta](https://ai.meta.com/)** pursued its open-model strategy ([LLaMA](<https://en.wikipedia.org/wiki/Llama_(language_model)>)) but [pivoted to closed models in late 2025](https://winbuzzer.com/2025/12/09/meta-pivots-from-llama-to-closed-ai-models-abandoning-open-source-roots-xcxwbn/) with the creation of Meta Superintelligence Labs. In July 2025, Zuckerberg [admitted that "developing superintelligence is now in sight"](https://techcrunch.com/2025/07/30/zuckerberg-says-meta-likely-wont-open-source-all-of-its-superintelligence-ai-models/) while stating that Meta would not open-source its most powerful models. The [Future of Life Institute](https://futureoflife.org/) gave Meta a grade of [D on its AI existential safety index](https://fortune.com/2025/12/05/ai-labs-meta-deepseek-xai-bad-grades-existential-safety-index/), the worst among the major American labs.

**[xAI](https://x.ai/)** (Elon Musk) is accelerating aggressively: [Grok 3](https://x.ai/blog/grok-3) (February 2025), Grok 4 (July 2025), with a [200,000-GPU "Colossus" datacenter](https://x.ai/colossus) and [plans to exceed a million](https://introl.com/blog/xai-colossus-2-gigawatt-expansion-555k-gpus-january-2026). The irony is striking: Musk, who warned about AI's existential risks and co-signed the [open letter calling for a pause in 2023](https://futureoflife.org/open-letter/pause-giant-ai-experiments/), now runs one of the most aggressive players in the race. xAI was [integrated into the US Department of Defense's GenAI.mil platform](https://www.war.gov/News/Releases/Release/Article/4366573/the-war-department-to-expand-ai-arsenal-on-genaimil-with-xai/) in early 2026, for 3 million military and civilian personnel.

**[Anthropic](https://www.anthropic.com/)** remains the most serious company on safety, with its [responsible scaling policy](https://www.anthropic.com/responsible-scaling-policy) and pioneering research such as the [alignment faking](https://www.anthropic.com/research/alignment-faking) study. The company activated [ASL-3 level protections](https://www.anthropic.com/news/activating-asl3-protections) for its most powerful models. But it too develops increasingly capable models and was [valued at 380 billion dollars in February 2026](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation), illustrating the fundamental dilemma: even the most cautious players are caught in the race dynamic.

**Chinese labs** (DeepSeek, Baidu, Alibaba, ByteDance) have made spectacular progress. [DeepSeek-R1](https://en.wikipedia.org/wiki/DeepSeek), released in [January 2025](https://www.technologyreview.com/2025/01/24/1110526/china-deepseek-top-ai-despite-sanctions/), demonstrated performance comparable to the best American models while having been [trained for only 5.6 million dollars](https://www.csis.org/analysis/deepseeks-latest-breakthrough-redefining-ai-race), compared to over 100 million for GPT-4. Its launch caused an [18% drop in Nvidia's stock](https://www.ibm.com/think/insights/deepseek-breakthrough-is-a-win-for-innovation-and-accessibility), described as a "Sputnik moment" for American AI.

The investment ratio between capabilities and alignment remains roughly 1,000:1. The race is accelerating and safety remains the poor relation.

### What about China?

The situation has evolved since 2023. At that time, China had the strictest AI regulations in the world: chatbots banned, training on internet data not allowed. Since then, the country has [relaxed its position](https://asia.nikkei.com/Business/Technology/China-approves-AI-chatbot-releases-but-will-it-unleash-innovation) so as not to slow down its industry.

The emergence of [DeepSeek](https://en.wikipedia.org/wiki/DeepSeek) transformed the dynamic: China shifted to a posture of confidence, accelerating investment and deployment of AI in critical infrastructure. DeepSeek demonstrated that [American chip export restrictions do not prevent Chinese AI innovation](https://www.technologyreview.com/2025/01/24/1110526/china-deepseek-top-ai-despite-sanctions/) but on the contrary stimulate more efficient approaches.

Even so, the argument for an international treaty remains valid. China was the only country to mention the possibility of a moratorium at the [United Nations Security Council meeting on AI](https://news.un.org/en/story/2023/07/1138947). In 2025, sixteen Chinese companies including DeepSeek signed commitments on AI safety, showing that convergence on safeguards exists.

We are calling for an international moratorium, imposed by a treaty. Such a treaty must also be signed by China. If the treaty guarantees that other nations will stop too, with sufficient verification and enforcement mechanisms, China will probably be in favor of it. This nonetheless requires international political will that remains, for now, insufficient given the scale of the [US-China geopolitical tensions](https://www.csis.org/analysis/deepseeks-latest-breakthrough-redefining-ai-race).

### Are AI companies claiming existential risk is real just to manipulate us?

We cannot be certain of these companies' motivations, and we know that they **are not the source of the focus on AI existential risks**. The warning signals came from scientists, activists and NGOs. Since the early 2000s, researchers such as [Eliezer Yudkowsky](https://en.wikipedia.org/wiki/Eliezer_Yudkowsky), [Nick Bostrom](https://en.wikipedia.org/wiki/Nick_Bostrom), [Stuart Russell](https://en.wikipedia.org/wiki/Stuart_J._Russell) and [Max Tegmark](https://en.wikipedia.org/wiki/Max_Tegmark) have warned about this risk. They had no product to sell.

Companies only began mentioning existential risks in May 2023, under pressure from public discourse: [Geoffrey Hinton's resignation from Google](https://fortune.com/2023/05/01/godfather-ai-geoffrey-hinton-quit-google-regrets-lifes-work-bad-actors/), [PauseAI's first protests](https://pauseai.info/openai-protest), the [Center for AI Safety statement](https://www.safe.ai/work/statement-on-ai-risk) signed by employees of OpenAI, Google and Microsoft.

But **events since 2024 show that commercial incentives outweigh safety concerns.** OpenAI [disbanded its Superalignment team](https://www.cnbc.com/2024/05/17/openai-superalignment-sutskever-leike.html) then its [Mission Alignment team](https://techcrunch.com/2026/02/11/openai-disbands-mission-alignment-team-which-focused-on-safe-and-trustworthy-ai-development/), [completed its transition to for-profit](https://openai.com/our-structure/), [removed the word "safely" from its mission](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467), and [imposed non-disparagement clauses threatening former employees' equity](https://www.cnbc.com/2024/05/24/openai-sends-internal-memo-releasing-former-employees-from-non-disparagement-agreements-sam-altman.html). The company also [actively lobbied against California's SB 1047 bill](https://techcrunch.com/2024/08/21/openais-opposition-to-californias-ai-law-makes-no-sense-says-state-senator/), which would have required safety testing before deployment. These are not the actions of a company that takes the risks seriously.

Our interpretation: AI companies _know_ the risks are real (they employ safety researchers, they publish studies on [alignment faking](https://www.anthropic.com/research/alignment-faking)), but commercial incentives and the race dynamic push them to keep going anyway. This is precisely why government intervention is needed: market actors cannot solve a [coordination problem](https://en.wikipedia.org/wiki/Tragedy_of_the_commons) of this magnitude on their own.

[PauseAI Global: learn more about the mental burden of existential risks](https://pauseai.info/psychology-of-x-risk)

## Getting involved

### Who funds you?

Pause AI has been a [registered non-profit organization](/en/mentions-legales) since June 2024. **We receive no funding from AI companies or any technology company**: our independence from the industry is total. The professionalization of the association (hiring an executive director, organizing events like the Senate conference) was made possible by donations from our supporters. You can [donate to Pause AI](/en/dons) if you wish to support our cause. We use most of the money for organizing impactful events, awareness campaigns and running our organization.

### Why protest?

- Protesting shows everyone that this issue matters to us. By protesting, we prove that we are willing to devote time and energy to spreading our message.
- It is not uncommon for protests to have a [positive influence](https://www.socialchangelab.org/_files/ugd/503ba4_052959e2ee8d4924934b7efe3916981e.pdf) on public opinion, voting, corporate attitudes and the law.
- [The vast majority of people support](https://today.yougov.com/politics/articles/31718-do-protesters-want-help-or-hurt-america) peaceful, non-violent protests.
- There is [no "backlash"](https://journals.sagepub.com/doi/full/10.1177/2378023120925949) unless the protest [turns violent](https://news.stanford.edu/stories/2018/10/how-violent-protest-can-backfire). Our protests are peaceful and non-violent.
- It is an experience of social connection. You meet other people who share your concerns and your willingness to act.
- Read [this excellent article](https://forum.effectivealtruism.org/posts/4ez3nvEmozwPwARr9/a-case-for-the-effectiveness-of-protest) to learn more about the effectiveness of protests.

Protests are, however, only one tool among others. This is why the association diversifies its modes of action: lobbying decision-makers, institutional events like our [Senate conference](https://www.smartrezo.com/n31-france/tv-politiques-numeriques-pol-n-colloque-sur-les-dangers-de-l-ia-faut-il-appuyer-sur-pause.html?vod=25808), content production and awareness campaigns.

### I want to help! What can I do?

There are many things [you can do](/en/agir). On an individual level, raise awareness among those around you, [make a donation](/en/dons) and [join Pause AI](/en/rejoindre) to coordinate your actions with all our members. If you want to get more involved, you can also become a volunteer.

The scale of the challenge must not be downplayed, but it does not justify inaction. Every effort to bend the current trajectory has immense value, proportional to what is at stake. Even a marginal contribution to reducing the risk has considerable value when the survival of humanity is at stake.
