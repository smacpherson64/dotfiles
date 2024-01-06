#!/usr/bin/env -S deno run --allow-env=PLUGIN_URL,DENO_DIR,HOME --allow-write --allow-read --unstable --allow-ffi

/**
 * VanJS version
 *
 * CONS:
 * - Missing a template of JSX, the functions do work but they are a bit more verbose and harder to parse visually, but not too bad.
 *
 * PROS:
 * - No build step required
 * - auto formatting
 * - JS composition
 * - Easy to create components 
 */

import van from 'https://deno.land/x/minivan@0.5.3/src/van-plate.js'

import {SizeHint, Webview} from 'https://deno.land/x/webview@0.7.6/mod.ts'

import {AppEvent, createEvent, getEvents} from '../data/export.ts'
import {getDayOfYear, toSeconds} from '../_helpers/dates.ts'
import {getRandomInt} from '../_helpers/numbers.ts'

import tips from "../data/tips.json" with { type: "json" };
import values from "../data/values.json" with { type: "json" };

const {
  form,
  script,
  head,
  header,
  strong,
  body,
  button,
  input,
  footer,
  span,
  section,
  div,
} = van.tags

const html = van.html

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
      other: 0,
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

const MainPage = ({state}: {state: State}) => {
  const waterConsumptionPercentage = state.waterConsumed
  ? Math.min(100, Math.round((state.waterConsumed / 96) * 100))
  : 0;

  return html(
    {lang: 'en-US', class: 'bg-slate-800'},
    head(
      script({src: 'https://cdn.tailwindcss.com'}),
      script(
        {async: '', defer: ''},
        `
        function handleEvent(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          formData.append(event.submitter.name, event.submitter.value);
          const data = Object.fromEntries(formData)
          
          Object.entries(data).forEach(function iterate([key, value]) {
            data[key] = data[key].toLowerCase();
            
            if (value === "") {
              delete data[key]
            }}
          )
          
          submit({at: new Date().toISOString(), data})
        }
        document.addEventListener('submit', handleEvent)
      `,
      )
    ),

    body(
      {class: 'h-screen'},
      form(
        {id: 'daily', class: 'h-full'},
        button({class: 'sr-only'}, 'Submit'),
        section(
          {class: 'p-3'},
          header({class: 'sr-only'}, 'How are you?'),
          div(
            {class: 'grid grid-cols-6 text-[36px] mt-2'},

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'happy',
                'aria-label': 'happy',
              },
              '😀',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'excited',
                'aria-label': 'excited',
              },
              '🥳',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'loved',
                'aria-label': 'loved',
              },
              '😊',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'wonder',
                'aria-label': 'wonder',
              },
              '🤩',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'playful',
                'aria-label': 'playful',
              },
              '😋',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'shocked',
                'aria-label': 'shocked',
              },
              '🫢',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'pensive',
                'aria-label': 'pensive',
              },
              '🤔',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'pained',
                'aria-label': 'pained',
              },
              '😑',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'overwhelmed',
                'aria-label': 'overwhelmed',
              },
              '😵‍💫',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'tired',
                'aria-label': 'tired',
              },
              '😴',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'angry',
                'aria-label': 'angry',
              },
              '😠',
            ),

            button(
              {
                type: 'submit',
                class:
                  'hover:scale-125 active:scale-95 transition-transform leading-tight',
                name: 'emotion',
                value: 'sad',
                'aria-label': 'sad',
              },
              '🙁',
            ),
          ),

          input({
            placeholder: 'Whats on your mind?',
            name: 'info',
            class:
              'p-1 text-xs w-full text-slate-100 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-700 placeholder-slate-700 border-slate-800 border-2 mt-1',
          }),
        ),
        section(
          {class: 'p-3 bg-slate-700/40'},

          header(
            {class: 'text-[11px] text-slate-500 tracking-tight'},
            'Something to ponder:',
          ),

          div(
            {class: 'p-3 text-white text-sm font-thin'},

            strong(state.value.value),
            state.value.description,
          ),
        ),
        section(
          {class: 'p-3'},

          header(
            {
              class:
                'text-[11px] text-slate-500 tracking-tight flex justify-between',
            },

            span('Tip:'),
          ),

          div(
            {class: 'p-3 text-slate-400 text-[11px] font-light h-[3em]'},
            state.tip,
          ),
        ),
        section(
          {class: 'p-3 bg-slate-700/40'},

          header(
            {class: 'text-[11px] text-slate-500 tracking-tight'},

            span('Water consumption:'),
          ),

          div(
            div(
              {class: 'flex gap-2 mt-3'},

              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'water-consumption',
                  value: '12',
                  'aria-label': '12',
                },
                '🚰',
              ),
              div(
                {class: 'flex-1 w-full'},
                div(
                  {class: 'w-full bg-slate-700 rounded-full h-2.5'},
                  div({
                    class:
                      'bg-gradient-to-r from-blue-300 via-sky-500 to-blue-500 h-2.5 rounded-full',
                    style: `width: ${waterConsumptionPercentage}%;`
                  }),
                ),

                div(
                  {
                    class:
                      'grid w-[calc(100%+10px)] text-[9px] text-slate-500 gap-2 grid-cols-9',
                  },
                  span('0'),
                  span('12'),
                  span('24'),
                  span('36'),
                  span('48'),
                  span('60'),
                  span('72'),
                  span('84'),
                  span('96'),
                ),
              ),
            ),
          ),
        ),
        section(
          {class: 'p-3'},

          header(
            {class: 'text-[11px] text-slate-500 tracking-tight'},
            'Snack consumption',
          ),
          '',
          div(
            {class: 'grid grid-cols-6 text-[20px] mt-2'},

            div(
              {class: 'flex flex-col justify-center items-center'},
              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'snack-consumption',
                  value: 'banana',
                  'aria-label': 'banana',
                },
                '🍌',
              ),
              span(
                {class: 'text-[11px] text-slate-500'},
                `x${state.snacksConsumed.banana}`,
              ),
            ),
            div(
              {class: 'flex flex-col justify-center items-center'},

              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'snack-consumption',
                  value: 'apple',
                  'aria-label': 'apple',
                },
                '🍎',
              ),

              span(
                {class: 'text-[11px] text-slate-500'},
                `x${state.snacksConsumed.apple}`,
              ),
            ),
            div(
              {class: 'flex flex-col justify-center items-center'},

              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'snack-consumption',
                  value: 'blueberries',
                  'aria-label': 'blueberries',
                },
                '🫐',
              ),
              span(
                {class: 'text-[11px] text-slate-500'},
                `x${state.snacksConsumed.blueberries}`,
              ),
            ),
            div(
              {class: 'flex flex-col justify-center items-center'},

              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'snack-consumption',
                  value: 'nectarine',
                  'aria-label': 'nectarine',
                },
                '🍑',
              ),
              span(
                {class: 'text-[11px] text-slate-500'},
                `x${state.snacksConsumed.nectarine}`,
              ),
            ),
            div(
              {class: 'flex flex-col justify-center items-center'},

              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'snack-consumption',
                  value: 'popcorn',
                  'aria-label': 'popcorn',
                },
                '🍿',
              ),
              span(
                {class: 'text-[11px] text-slate-500'},
                `x${state.snacksConsumed.popcorn}`,
              ),
            ),
            div(
              {class: 'flex flex-col justify-center items-center'},

              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  'aria-label': 'ate another snack',
                },
                '❔',
              ),
              span(
                {class: 'text-[11px] text-slate-500'},
                `x${state.snacksConsumed.other}`,
              ),
            ),
          ),

          input({
            autocapitalize: 'none',
            placeholder: 'Other?',
            name: 'snack-consumption',
            class:
              'p-1 text-xs w-full text-slate-100 bg-transparent focus:ring-0 focus:outline-none focus:border-blue-700 placeholder-slate-700 border-slate-800 border-2 mt-1',
          }),
        ),

        section(
          {class: 'p-3  bg-slate-700/40'},

          header(
            {
              class:
                'text-[11px] text-slate-500 tracking-tight flex justify-between',
            },

            span('Posture:'),

            span(
              {class: 'text-[11px] text-slate-500 tracking-tight'},
              `Currently: ${state.posture.current}`,
            ),
          ),

          div(
            {class: 'p-3 grid grid-cols-2 text-[70px] leading-none'},

            div(
              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'posture',
                  value: 'sitting',
                  'aria-label': 'switch to sitting',
                },
                '🪑',
              ),

              span(
                {class: 'text-[11px] text-slate-500'},
                getTimeDiff(state.posture.sitting),
              ),
            ),

            div(
              button(
                {
                  type: 'submit',
                  class:
                    'hover:scale-125 active:scale-95 transition-transform leading-tight',
                  name: 'posture',
                  value: 'standing',
                  'aria-label': 'switch to standing',
                },
                '🧍‍♂️',
              ),

              span(
                {class: 'text-[11px] text-slate-500'},
                getTimeDiff(state.posture.standing),
              ),
            ),
          ),
        ),

        footer(
          {class: 'text-[9px] text-slate-600'},
          `Last updated: ${state.lastUpdated}`,
        ),
      ),
    ),
  )
        }

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

  const url = dataURL(MainPage({state}))
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

webview.title = 'Daily Tracker'
webview.run()
