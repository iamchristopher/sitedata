/* jshint node: true, deve: true, browserify: true */
"use strict"
const got = require("got")
import "babel-polyfill";

const SiteData = function(options) {
  const self = this
  if (!options.token) throw "Token is required"

  this.token = options.token

  this.baseUri = "https://api.sitedata.io/v1"

  this.api = {
    summary: {
      hosts: async function(options = {}) {
        return await self.fetch("summary/hosts", options)
      },
      metrics: async function(options = {}) {
        if (!options.url) throw "Url is required"
        return await self.fetch("summary/metrics", options)
      }
    },
    metric: {
      index: async function(options = {}) {
        if (!options.url) throw "Url is required"
        return await self.fetch("metric/index", options)
      },
      lighthouse: async function(options = {}) {
        if (!options.url) throw "Url is required"
        return await self.fetch("metric/lighthouse", options)
      },
      wave: async function(options = {}) {
        if (!options.url) throw "Url is required"
        return await self.fetch("metric/wave", options)
      },
      screenshot: async function(options = {}) {
        if (!options.url) throw "Url is required"
        return await self.fetch("metric/screenshot", options)
      },
      source: async function(options = {}) {
        if (!options.url) throw "Url is required"
        return await self.fetch("metric/source", options)
      }
    }
  }
  return this.api
}

SiteData.prototype.fetch = async function(metric, options) {
  const self = this
  let returnValue = []
  let next = null
  let page = 1

  do {
    const endUrl = `${self.baseUri}/${metric}?token=${self.token}&page=${page}&url=${options.url ||
      ""}&match=${options.match || "contains"}`
    const results = await got(endUrl)
    const r = JSON.parse(results.body)
    next = r.links.next
    page++
    returnValue = returnValue.concat(r.data)
  } while (next)
  return returnValue
}
module.exports = SiteData
