import { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import i18nextConfig from '@/next-i18next.config'
import LanguageSwitchLink from './LanguageSwitchLink'
import languageDetector from '@/lib/languageDetector'
import { returnHref } from '@/lib/tool'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const SwitchBox = () => {
  const [selected, setSelected] = useState({})
  const [languages, setLanguages] = useState([]);
  const router = useRouter()
  const { t } = useTranslation('footer')
  const { locale } = router.query;
  languageDetector.cache(locale)
  // 异步加载语言配置
  const fetchLanguages = async () => {
    const response = await fetch('/languages.json');
    const data = await response.json();
    setLanguages(data.languages);

    if (locale) {
      setSelected(data.languages.find(item => item.code === locale))
    } else {
      setSelected(data.languages[0])
    }
  };
  // fetchLanguages();
  useEffect(() => {
    fetchLanguages();
  }, []);
  useEffect(() => {
    let pName = router.pathname
    const link = returnHref(router, selected.code)
    selected.code && router.push(link)

  }, [selected])
  const currentLocale =
    router.query.locale || i18nextConfig.i18n.defaultLocale
  return (
    <div className='px-8 pb-8 max-w-80 m-auto flex flex-wrap items-center justify-evenly place-content-between'>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{t('switch_language')}</Listbox.Label>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">{selected.label}</span>
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {languages.map((person) => (
                    <Listbox.Option
                      key={person.code}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none'
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'p-3 ml-3 block truncate')}
                            >
                              {person.label}
                            </span>
                          </div>
                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>

    </div>
  )
}

