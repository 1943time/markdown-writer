import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkDirective from 'remark-directive'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

export const parser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkDirective)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify)
