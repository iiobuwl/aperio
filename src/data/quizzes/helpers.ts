// テストの問題を短く書くための道具です。
// 選択肢は「正解を先頭」に書きます(画面に出すときに自動でシャッフルされます)。

import type { ChoiceQ, FillQ, Options4 } from '../types'

/** 4択: c('問題文', ['正解', 'まちがい', 'まちがい', 'まちがい'], '解説') */
export const c = (q: string, options: Options4, why: string): ChoiceQ => ({ q, options, why })

/** 穴埋め: f(['コード', '___ が空欄'], ['正解', 'まちがい', 'まちがい', 'まちがい'], '解説') */
export const f = (code: string[], options: Options4, why: string): FillQ => ({ code, options, why })
