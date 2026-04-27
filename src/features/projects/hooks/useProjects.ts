import { useQuery } from '@tanstack/react-query'
import type { Project } from '../../../types'

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'آسالویه فاز ۱۴',
    location: 'آسالویه',
    status: 'critical',
    plannedProgress: 75,
    actualProgress: 62,
    discipline: 'نفت و گاز',
    startDate: '1402/01/01',
    endDate: '1404/06/31',
    description: 'توسعه فاز ۱۴ پارس جنوبی با هدف تولید روزانه ۵۶ میلیون متر مکعب گاز',
  },
  {
    id: '2',
    name: 'ماهشهر پتروشیمی',
    location: 'ماهشهر',
    status: 'on-track',
    plannedProgress: 45,
    actualProgress: 47,
    discipline: 'پتروشیمی',
    startDate: '1402/04/01',
    endDate: '1404/12/29',
    description: 'احداث واحد اتیلن با ظرفیت ۱.۲ میلیون تن در سال',
  },
  {
    id: '3',
    name: 'بندر امام کمپلکس',
    location: 'بندر امام خمینی',
    status: 'delayed',
    plannedProgress: 60,
    actualProgress: 48,
    discipline: 'پالایشگاه',
    startDate: '1401/07/01',
    endDate: '1404/06/31',
    description: 'بهسازی و توسعه مجتمع پتروشیمی بندر امام',
  },
  {
    id: '4',
    name: 'آسالویه LNG',
    location: 'آسالویه',
    status: 'critical',
    plannedProgress: 80,
    actualProgress: 65,
    discipline: 'LNG',
    startDate: '1401/01/01',
    endDate: '1404/01/01',
    description: 'احداث خط تولید LNG با ظرفیت ۱۰.۸ میلیون تن در سال',
  },
  {
    id: '5',
    name: 'اراک الفین',
    location: 'اراک',
    status: 'on-track',
    plannedProgress: 55,
    actualProgress: 56,
    discipline: 'الفین',
    startDate: '1402/06/01',
    endDate: '1405/06/31',
    description: 'توسعه واحد الفین برای تولید پروپیلن و اتیلن',
  },
  {
    id: '6',
    name: 'پالایشگاه تبریز',
    location: 'تبریز',
    status: 'completed',
    plannedProgress: 100,
    actualProgress: 100,
    discipline: 'پالایشگاه',
    startDate: '1400/01/01',
    endDate: '1403/06/31',
    description: 'ارتقاء و نوسازی پالایشگاه تبریز',
  },
]

async function fetchProjects(): Promise<Project[]> {
  await new Promise(r => setTimeout(r, 500))
  return MOCK_PROJECTS
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}

export { MOCK_PROJECTS }
