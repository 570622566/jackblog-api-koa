import { test, describe, before, after, beforeEach, afterEach } from 'ava-spec'
import config from '../../server/config/env'
import { koaApp } from '../helpers/app'
import sinon from 'sinon'
import qiniuHelper, {bucket} from '../../server/util/qiniu'

const mockKey = 'PwzqKey'
const mockUrl = 'http://www.test.com/test.png'
const mockBucket = bucket
const mockPath = './test.png'
let stubFetch,uploadStub,moveStub,copyStub,removeStub,listStub

before(async t => {
  uploadStub = sinon.stub(qiniuHelper,'upload').returns(Promise.resolve({key: '/blog/article/test.png'}))
  stubFetch = sinon.stub(qiniuHelper,'fetch')
  stubFetch.withArgs(mockUrl,mockKey).returns(
    Promise.resolve({key:'/blog/article/test.png'})
  )
  moveStub = sinon.stub(qiniuHelper,'move').returns(Promise.resolve({key:'/blog/article/test.png'}))
  copyStub = sinon.stub(qiniuHelper,'copy').returns(Promise.resolve({key:'/blog/article/test.png'}))
  removeStub = sinon.stub(qiniuHelper,'remove').returns(Promise.resolve({key:'/blog/article/test.png'}))
  listStub = sinon.stub(qiniuHelper,'list').returns(Promise.resolve({items:[{key:'/blog/article/test.png'}]}))
})

after(async () => {
  uploadStub.restore()
  stubFetch.restore()
  moveStub.restore()
  copyStub.restore()
  removeStub.restore()
  listStub.restore()
})

describe('test/util/qiniu.js => upload', it => {
  it.serial('should return success result', async t => {
    const uploadResult = await qiniuHelper.upload(mockPath,mockKey)
    t.is(uploadResult.key, '/blog/article/test.png')
    t.true(uploadStub.calledOnce)
  })
})

describe('test/util/qiniu.js => fetch', it => {
  it.serial('should return success result', async t => {
    const fetchResult = await qiniuHelper.fetch(mockUrl,mockKey)
    t.is(fetchResult.key, '/blog/article/test.png')
    t.true(stubFetch.calledOnce)
  })
})

describe('test/util/qiniu.js => move', it => {
  it.serial('should return success result', async t => {
    const moveResult = await qiniuHelper.move('keySrc','keyDest')
    t.is(moveResult.key, '/blog/article/test.png')
    t.true(moveStub.calledOnce)
  })
})

describe('test/util/qiniu.js => copy', it => {
  it.serial('should return success result', async t => {
    const copyResult = await qiniuHelper.copy('keySrc','keyDest')
    t.is(copyResult.key, '/blog/article/test.png')
    t.true(copyStub.calledOnce)
  })
})

describe('test/util/qiniu.js => remove', it => {
  it.serial('should return success result', async t => {
    const removeResult = await qiniuHelper.remove('key')
    t.is(removeResult.key, '/blog/article/test.png')
    t.true(removeStub.calledOnce)
  })
})

describe('test/util/qiniu.js => list', it => {
  it.serial('should return success result', async t => {
    const listResult = await qiniuHelper.list({prefix:'prefix', marker:'marker', limit:'limit'})
    t.is(listResult.items.length, 1)
    t.true(listStub.calledOnce)
  })
})