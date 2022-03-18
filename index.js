const fs = require('fs')
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`)
const dataObj = JSON.parse(data)

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
)
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
)
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
)

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    if (pathname === '/' || pathname === '/overview') {
        const cards = dataObj.map((product) =>
            replaceTemplate(tempCard, product)
        )
        const output = tempOverview.replace(/{%PRODUCTS_CARDS%}/g, cards)

        res.writeHead(200, {
            'Content-type': 'text/html',
        })
        res.end(output)
    } else if (pathname === '/product') {
        const productIndex = dataObj.findIndex((el) => el.id === +query.id)
        const output = replaceTemplate(tempProduct, dataObj[productIndex])

        res.writeHead(200, {
            'Content-type': 'text/html',
        })

        res.end(output)
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application-json',
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        })

        res.end('<h1>Page not found!</h1>')
    }
})

server.listen(8000, '127.0.0.1')

// console.log(replaceTemplate(tempCard, dataObj[1]))
