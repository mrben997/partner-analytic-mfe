import { ChartData } from 'chart.js'
import { IChartData } from './type'

type TGenerateLineChartDataFunc = (parmas: IChartData, index: number) => ChartData<'line', number[], string>
export const GenerateLineChartData: TGenerateLineChartDataFunc = ({ labels, details }, index) => {
  return {
    labels: labels ?? [],
    datasets: [
      {
        label: details[index]?.title ?? 'No name',
        data: details[index]?.value ?? [],
        fill: { target: 'origin', above: 'rgb(154 208 245 / 30%)' },
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 0.85)',
        borderWidth: 2,
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: 'white',
      },
    ],
  }
}

export const HumanNumber = (bytes: number, dp = 1) => {
  const thresh = 1000
  if (Math.abs(bytes) < thresh) return bytes + ''

  const units = ['k', 'M', 'B']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + ' ' + units[u]
}

const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item)

export function MergeDeep<TModel = any>(target: any, ...sources: any[]): TModel {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        MergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return MergeDeep(target, ...sources)
}

export const FormatterUSD = () => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export const FormatNumber = new Intl.NumberFormat('en-US')