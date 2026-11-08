// 画面の上のタブ(学ぶ / チャレンジ)と、URL に応じたページを出します。
//   #/                  → 学ぶ: 言語選択(LanguageSelect)
//   #/言語              → 項目一覧(ItemList)
//   #/言語/項目         → 中身のページ(図なら TopicPage、解説なら LessonPage)
//   #/言語/項目/test    → 項目のテスト(QuizPage)
//   #/challenge         → チャレンジ(Challenge): 範囲・難易度・問題数を選んで挑戦
// 該当するものがない URL は、言語選択を出します。

import { LANGUAGES } from './data/languages'
import { href, useRoute } from './router'
import { TabBar } from './components/TabBar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LanguageSelect } from './pages/LanguageSelect'
import { ItemList } from './pages/ItemList'
import { TopicPage } from './pages/TopicPage'
import { LessonPage } from './pages/LessonPage'
import { QuizPage } from './pages/QuizPage'
import Challenge from './pages/Challenge'

function Page({ route }: { route: string[] }) {
  const [langId, itemId, sub] = route

  if (langId === 'challenge') return <Challenge />

  const lang = LANGUAGES.find((l) => l.id === langId)
  if (!lang) return <LanguageSelect languages={LANGUAGES} />

  const item = lang.items.find((i) => i.id === itemId)
  if (item?.quiz && sub === 'test') {
    return <QuizPage key={`${lang.id}/${item.id}/test`} language={lang} item={item} />
  }

  if (item?.topic) {
    // key: 別の項目に移ったとき、ステップ番号などを最初からにする
    return (
      <TopicPage
        key={`${lang.id}/${item.id}`}
        topic={item.topic}
        backHref={href(lang.id)}
        backLabel={lang.name}
        quizHref={item.quiz ? href(lang.id, item.id, 'test') : undefined}
      />
    )
  }

  if (item?.lesson) {
    return <LessonPage key={`${lang.id}/${item.id}`} language={lang} item={item} />
  }

  return <ItemList key={lang.id} language={lang} />
}

export default function App() {
  const route = useRoute()
  return (
    <>
      <TabBar active={route[0] === 'challenge' ? 'challenge' : 'learn'} />
      {/* ページが変わるたびに、エラー画面を作りなおす(エラーが出たページから、タブで出られる) */}
      <ErrorBoundary key={route.join('/')}>
        <Page route={route} />
      </ErrorBoundary>
    </>
  )
}
