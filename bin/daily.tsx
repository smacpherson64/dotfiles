#!/usr/bin/env -S deno run --allow-env=PLUGIN_URL,DENO_DIR,HOME --allow-write --allow-read --unstable --allow-ffi

import * as React from 'npm:react'
import {ComponentProps} from 'npm:@types/react'
import * as ReactDOMServer from 'npm:react-dom/server'
import {SizeHint, Webview} from 'https://deno.land/x/webview@0.7.6/mod.ts'

import {AppEvent, createEvent, getEvents} from '../data/export.ts'
import {getDayOfYear, toSeconds} from '../_helpers/dates.ts'
import {getRandomInt} from '../_helpers/numbers.ts'

import tips from "../data/tips.json" with { type: "json" };
import values from "../data/values.json" with { type: "json" };

/**
- Tired? (Body or mind?) body - rest, mind - meditation & rest
- Bored? (purpose wonder exercise variance creativity train)
- Happy
- Frustrated / Angry (fear training, breathing, ego dump, meditation)
- Overwhelmed (break, rest, focus, breath, deconstruct)
- Hungry
- Recognizing when I am in “focus mode”
- Step back and "see more"
- Do I know what day it is?
- Do I remember what happened this week?
- What am I focusing on? Why?
 */


const todaysValue = values[getDayOfYear(new Date()) % values.length]
let lastTip = tips[getRandomInt(0, tips.length - 1)]

///////////////////////////////////
// State
///////////////////////////////////

type State = {
  value: {value: string; description: string}
  tip: string
  waterConsumed: number
  snacksConsumed: {
    [key: string]: number
  }
  posture: {
    last?: null | AppEvent
    current?: 'standing' | 'sitting'
    sitting: number
    standing: number
  }
  lastUpdated: string
}

function getState(events: AppEvent[]) {
  // get and set next tip
  const nextTipIndex = tips.findIndex((item) => item === lastTip) + 1
  const nextTip = tips[nextTipIndex >= tips.length ? 0 : nextTipIndex]
  lastTip = nextTip

  const state: State = {
    value: todaysValue,
    tip: nextTip,
    waterConsumed: 0,
    snacksConsumed: {
      apple: 0,
      banana: 0,
      blueberries: 0,
      nectarine: 0,
      popcorn: 0,
      other: 0
    },
    posture: {
      last: null,
      sitting: 0,
      standing: 0,
    },
    lastUpdated: new Date().toISOString(),
  }

  for (const event of events) {
    if (event.name === 'posture') {
      state.posture.current = event.value

      const last = state.posture.last

      if (last) {
        const prev = toSeconds(last.timestamp)
        const now = toSeconds(event.timestamp)
        const diff = Math.floor(now - prev)

        // Add all the time to the previous posture.
        if (last.value === 'sitting' && event.value === 'standing') {
          state.posture.sitting += diff
        } else if (last.value === 'standing' && event.value === 'sitting') {
          state.posture.standing += diff
        }

        if (last.value !== event.value) {
          state.posture.last = event
        }
      } else {
        state.posture.last = event
      }
    }

    if (event.name === 'water-consumption') {
      state.waterConsumed += Number(event.value ?? 0)
    }

    if (event.name === 'snack-consumption') {
      switch (event.value) {
        case 'apple': {
          state.snacksConsumed.apple += 1
          break
        }

        case 'banana': {
          state.snacksConsumed.banana += 1
          break
        }

        case 'blueberries': {
          state.snacksConsumed.blueberries += 1
          break
        }

        case 'nectarine': {
          state.snacksConsumed.nectarine += 1
          break
        }

        case 'popcorn': {
          state.snacksConsumed.popcorn += 1
          break
        }
        
        default: {
          state.snacksConsumed.other += 1
          break
        }
      }
    }
  }

  const last = state.posture.last

  if (last && state.posture.current) {
    state.posture[state.posture.current] +=
      toSeconds(new Date()) - toSeconds(last.timestamp)
  }

  return state
}

///////////////////////////////////
// Components
///////////////////////////////////

function getTimeDiff(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return [hours && `${hours}H`, minutes && `${minutes}M`]
    .filter(Boolean)
    .join(' ')
}

function EmojiButton(props: ComponentProps<'button'>) {
  return (
    <button
      type="submit"
      className="hover:scale-125 active:scale-95 transition-transform leading-tight"
      {...props}
    />
  )
}

function EmotionButton({
  emotion,
  children,
}: {
  emotion: string
  children: string
}) {
  return (
    <EmojiButton
      name="emotion"
      value={emotion}
      title={emotion}
      aria-label={emotion}>
      {children}
    </EmojiButton>
  )
}

const MainPage = ({state}: {state: State}) => (
  <html lang="en-US" className="bg-slate-800">
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
      <script
        async
        defer
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            formData.append(event.submitter.name, event.submitter.value)
            const data = Object.fromEntries(formData)

            Object.entries(data).forEach(([key, value]) => {
              data[key] = data[key].toLowerCase()

              if (value === "") {
                delete data[key]
              }
            })

            submit({at: new Date().toISOString(), data})
          })
          `,
        }}></script>
    </head>

    <body className="h-screen">
      <form id="daily" className="h-full">
        <button className="sr-only">Submit</button>
        <section className="p-3">
          <header className="sr-only">
            How are you?
          </header>
          <div className="grid grid-cols-6 text-[36px] mt-2">
            <EmotionButton emotion="happy">😀</EmotionButton>
            <EmotionButton emotion="excited">🥳</EmotionButton>
            <EmotionButton emotion="loved">😊</EmotionButton>
            <EmotionButton emotion="wowed">🤩</EmotionButton>
            <EmotionButton emotion="playful">😋</EmotionButton>
            <EmotionButton emotion="shocked">🫢</EmotionButton>
            <EmotionButton emotion="pensive">🤔</EmotionButton>
            <EmotionButton emotion="pained">😑</EmotionButton>
            <EmotionButton emotion="overwhelmed">😵‍💫</EmotionButton>
            <EmotionButton emotion="tired">😴</EmotionButton>
            <EmotionButton emotion="angry">😠</EmotionButton>
            <EmotionButton emotion="sad">🙁</EmotionButton>
          </div>
          
          <input placeholder="Whats on your mind?" name="info" className="p-1 text-xs w-full text-slate-100 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-700 placeholder-slate-700 border-slate-800 border-2 mt-1" />
        </section>

        <section className="p-3 bg-slate-700/40">
          <header className="text-[11px] text-slate-500 tracking-tight">
            Something to ponder:
          </header>
          <div className="p-3 text-white text-sm font-thin">
            <strong>{state.value.value}</strong> {state.value.description}
          </div>
        </section>

        <section className="p-3">
          <header className="text-[11px] text-slate-500 tracking-tight flex justify-between">
            <span>Tip:</span>{' '}
          </header>
          <div className="p-3 text-slate-400 text-[11px] font-light h-[3em]">
            {state.tip}
          </div>
        </section>

        <section className="p-3 bg-slate-700/40">
          <header className="text-[11px] text-slate-500 tracking-tight">
            <span>Water consumption:</span>
          </header>

          <div>
            <div className="flex gap-2 mt-3">
              <EmojiButton name="water-consumption" value="12">
                🚰
              </EmojiButton>
              <div className="flex-1 w-full">
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${
                        state.waterConsumed
                          ? Math.min(100, (state.waterConsumed / 96) * 100)
                          : 0
                      }%`,
                    }}></div>
                </div>

                <div className="grid w-[calc(100%+10px)] text-[9px] text-slate-500 gap-2 grid-cols-9">
                  <span>0</span>
                  <span>12</span>
                  <span>24</span>
                  <span>36</span>
                  <span>48</span>
                  <span>60</span>
                  <span>72</span>
                  <span>84</span>
                  <span>96</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-3">
          <header className="text-[11px] text-slate-500 tracking-tight">
            Snack consumption
          </header>
          
          <div className="grid grid-cols-6 text-[20px] mt-2">
            <div className="flex flex-col justify-center items-center">
              <EmojiButton name="snack-consumption" value="banana">
                🍌
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                x{state.snacksConsumed.banana}
              </span>
            </div>

            <div className="flex flex-col justify-center items-center">
              <EmojiButton name="snack-consumption" value="apple">
                🍎
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                x{state.snacksConsumed.apple}
              </span>
            </div>

            <div className="flex flex-col justify-center items-center">
              <EmojiButton name="snack-consumption" value="blueberries">
                🫐
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                x{state.snacksConsumed.blueberries}
              </span>
            </div>

            <div className="flex flex-col justify-center items-center">
              <EmojiButton name="snack-consumption" value="nectarine">
                🍑
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                x{state.snacksConsumed.nectarine}
              </span>
            </div>

            <div className="flex flex-col justify-center items-center">
              <EmojiButton name="snack-consumption" value="popcorn">
                🍿
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                x{state.snacksConsumed.popcorn}
              </span>
            </div>

            <div className="flex flex-col justify-center items-center">
              <EmojiButton>
                ❔
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                x{state.snacksConsumed.other}
              </span>
            </div>
          </div>

          <input autoCapitalize="none" placeholder="Other?" name="snack-consumption" className="p-1 text-xs w-full text-slate-100 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-700 placeholder-slate-700 border-slate-800 border-2 mt-1" />
        </section>

        <section className="p-3  bg-slate-700/40">
          <header className="text-[11px] text-slate-500 tracking-tight flex justify-between">
            <span>Posture:</span>

            <span className="text-[11px] text-slate-500 tracking-tight">
              Currently: {state.posture.current}
            </span>
          </header>
          <div className="p-3 grid grid-cols-2 text-[70px] leading-none">
            <div>
              <EmojiButton name="posture" value="sitting">
                🪑
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                {getTimeDiff(state.posture.sitting)}
              </span>
            </div>

            <div>
              <EmojiButton name="posture" value="standing">
                🧍‍♂️
              </EmojiButton>
              <span className="text-[11px] text-slate-500">
                {getTimeDiff(state.posture.standing)}
              </span>
            </div>
          </div>
        </section>

        <footer className="text-[9px] text-slate-600">
          Last updated: {state.lastUpdated}
        </footer>
      </form>
    </body>
  </html>
)

///////////////////////////////////
// Webview
///////////////////////////////////

// Initial Events
const events = getEvents()

const webview = new Webview(false, {
  width: 300,
  height: 700,
  hint: SizeHint.FIXED,
})

function update() {
  const state = getState(events)

  function dataURL(text: string) {
    return `data:text/html;charset=UTF-8,${text}`
  }

  const url = dataURL(
    [
      `<!DOCTYPE html>`,
      ReactDOMServer.renderToString(<MainPage state={state} />),
    ].join('\n'),
  )
  webview.navigate(url)
}

webview.bind('submit', ({data}) => {
  const info = data.info

  for (const [name, value] of Object.entries(data)) {
    if (name === 'info') continue
    const event = createEvent({name, value, info})
    events.push(event)
    update()
  }
})

update()

// Webview is currently blocking and does not allow intervals.
// Using timeout as interval since update rerenders.
webview.bind('tick', update)
webview.init(`setTimeout(tick, 60000)`)

///////////////////////////////////
// Main
///////////////////////////////////

webview.title = ("Daily Tracker")
webview.run()