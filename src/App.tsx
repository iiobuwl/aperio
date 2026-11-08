// URL を見て、どの画面を出すかを決めるだけの部品です。
//   #/                  → トップ(Home): 「学ぶ」と「苦手リスト」
//   #/learn             → 言語選択(LanguageSelect)
//   #/weak              → 苦手リスト(WeakPage)
//   #/challenge         → チャレンジの入口(ChallengeHome)
//   #/challenge/言語/fill|explain → チャレンジの出題(ChallengePlay)
//   #/言語              → 項目一覧(ItemList)
//   #/言語/項目         → 中身のページ(図なら TopicPage、解説なら LessonPage)
//   #/言語/項目/test    → 項目のテスト(QuizPage)
// 該当するものがない URL は、トップを出します。

import { LANGUAGES } from './data/languages'
import { href, useRoute } from './router'
import { LanguageSelect } from './pages/LanguageSelect'
import { ItemList } from './pages/ItemList'
import { TopicPage } from './pages/TopicPage'
import { LessonPage } from './pages/LessonPage'
import { QuizPage } from './pages/QuizPage'
import { Home } from './pages/Home'
import { WeakPage } from './pages/WeakPage'
import { ChallengeHome } from './pages/ChallengeHome'
import { ChallengePlay } from './pages/ChallengePlay'

export default function App() {
  const [langId, itemId, sub] = useRoute()

  if (langId === 'learn') return <LanguageSelect languages={LANGUAGES} />
  if (langId === 'weak') return <WeakPage />
  if (langId === 'challenge') {
    // #/challenge/カテゴリ/fill または explain
    const target = LANGUAGES.find((l) => l.id === itemId)
    if (target && (sub === 'fill' || sub === 'explain')) {
      return <ChallengePlay key={`${target.id}/${sub}`} language={target} mode={sub} />
    }
    return <ChallengeHome />
  }

  const lang = LANGUAGES.find((l) => l.id === langId)
  if (!lang) return <Home />

  const item = lang.items.find((i) => i.id === itemId)
  if (item?.quiz && sub === 'test') {
    return <QuizPage key={`${lang.id}/${item.id}/test`} language={lang} item={item} />
  }

  if (item?.topic) {
    // key: 別の項目に移ったとき、ステップ番号などを最初からにする
    return <TopicPage key={`${lang.id}/${item.id}`} topic={item.topic} backHref={href(lang.id)} backLabel={lang.name} weakKey={`${lang.id}/${item.id}`}
        quizHref={item.quiz ? href(lang.id, item.id, 'test') : undefined}
      />
  }

  if (item?.lesson) {
    return <LessonPage key={`${lang.id}/${item.id}`} language={lang} item={item} />
  }

  return <ItemList key={lang.id} language={lang} />
}
