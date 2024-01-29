/**
 * 切换语言组件
 * 按钮组件
 */

import languageDetector from '@/lib/languageDetector'
import { returnHref } from '@/lib/tool'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const LanguageSwitchLink = ({ locale, ...rest }) => {
  const router = useRouter()
  const [href, setHref] = useState('')
  useEffect(() => {
    setHref(returnHref(router, locale))
  })
  return (
    <Link href={href}>
      <button
        style={{ fontSize: 'small' }}
        className='m-2'
        onClick={() => languageDetector.cache(locale)}
      >
        {locale}
      </button>
    </Link>
  )
}

export default LanguageSwitchLink
