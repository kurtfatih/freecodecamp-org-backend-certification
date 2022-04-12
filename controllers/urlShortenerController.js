const path = require("path")
const URL = require("url").URL
const dns = require("dns")
const ShortenerUrl = require("../model/url-shortener/ShortenerUrl")

const getUrlShortenerIndexHtml = (_, res) => {
  res.sendFile(path.join(__dirname, "../views/urlshortener/index.html"))
}

const getShortUrl = async (req, res) => {
  const { shortCode } = req.params
  if (!shortCode || isNaN(shortCode)) {
    return res.json({ error: "Invalid URL" })
  }

  const data = await ShortenerUrl.findOne({ shortCode: Number(shortCode) })

  if (!data) {
    return res.json({ error: "No short URL found for the given input" })
  }
  const redirectUrl = data.url
  return res.redirect(redirectUrl)
  // successfull req will redirect
  // return res.redirect(data.url)
}

// const getShortUrlWithoutSended async function (_, res) {
//   return res.send("Not found")
// }

const findOrCreateShortenerUrl = async (req, res) => {
  const { url } = req.body
  if (!url) res.status(400).send("Url required")
  const urlObject = new URL(url)
  dns.lookup(urlObject.hostname, async (err) => {
    if (err) {
      res.json({
        error: "Invalid URL"
      })
    } else {
      const lengthOfCollection = await ShortenerUrl.count()
      const data = await ShortenerUrl.findOne({ url })
      if (!data) {
        const createdUrlData = await ShortenerUrl.create({
          url,
          shortCode: lengthOfCollection + 1
        })
        return res
          .status(200)
          .json({ original_url: url, short_url: createdUrlData.shortCode })
      }
      return res
        .status(200)
        .json({ original_url: url, short_url: data.shortCode })
    }
  })
}

module.exports = {
  getUrlShortenerIndexHtml,
  getShortUrl,
  findOrCreateShortenerUrl
}
