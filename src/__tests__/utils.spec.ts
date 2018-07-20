import fs from 'jest-plugin-fs'
import fsMock from 'jest-plugin-fs/mock'
jest.mock('fs', () => require('jest-plugin-fs/mock'));

import { fsExists } from '../utils'

it('works with async/await', async () => {
  console.log(__filename)
  const res = await fsExists(__filename)
  expect(res).toEqual(false)
})

