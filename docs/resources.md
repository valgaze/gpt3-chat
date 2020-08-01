## GPT3 101

## Official Docs & paper

- Paper: https://arxiv.org/abs/2005.14165#:~:text=Recent%20work%20has%20demonstrated%20substantial,tuning%20on%20a%20specific%20task.

- Github repo: https://github.com/openai/gpt-3

- Root Dev tools: https://www.notion.so/Getting-Started-e8b69bfedfd84efa9855d373f797f794

## Transformers

- https://nostalgebraist.tumblr.com/post/185326092369/the-transformer-explained

- https://arxiv.org/abs/1706.03762

- http://jalammar.github.io/illustrated-transformer/

- https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/

## GPT3 Projects & Prompts

- https://github.com/martonlanga/gpt3-prompts

- https://gpt3examples.com/

- https://lacker.io/ai/2020/07/06/giving-gpt-3-a-turing-test.html

## Stray articles/write-ups

- https://www.greaterwrong.com/posts/ZHrpjDc3CepSeeBuE/gpt-3-a-disappointing-paper

- http://dailynous.com/2020/07/30/philosophers-gpt-3/

- https://maraoz.com/2020/07/18/openai-gpt3/

- https://jalammar.github.io/how-gpt3-works-visualizations-animations/

- https://arr.am/2020/07/25/gpt-3-uncertainty-prompts/

- https://minimaxir.com/2020/07/gpt3-expectations/

- https://leogao.dev/2020/05/29/GPT-3-A-Brief-Summary/

- http://www.bemmu.com/gpt3-presentation

- https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277

## APIFlags

_Tweak individual requests_

| item        | Example/Default | Remarks                                                                                   |
| ----------- | --------------- | ----------------------------------------------------------------------------------------- |
| engine      | davinci         | Engine id (there are 4 main engines ada/babbage/curie/davinci)                            |
| prompt      | //              | Input which will be "completed" by the system                                             |
| max_tokens  | 20              | How many "tokens" (words or portions of words) to return in a completion, max of 512      |
| temperature | 0.5             | 0-1, 0 means more predictable and more to 1 is more random                                |
| top_p       | //              | 0-1, represents a percentage threshold for values it will accept. Use this OR temperature |
| n           | //              | Number of choices to create for each prompt                                               |
| stream      | //              | True/false                                                                                |
| logprobs    | //              | Return n most likely tokens                                                               |
| stop        | \n              | Stopping character, won't proceed beyond                                                  |
