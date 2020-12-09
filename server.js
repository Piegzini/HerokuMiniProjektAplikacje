let express = require("express")
let app = express()
const PORT = process.env.PORT || 8080
let path = require("path")
let bodyParser = require('body-parser')


// zmienna czy jesteś zalogowany 
let loged = false
// Tabela trzymająca ninfomracje na temat użytkowników 
let users = [{
        id: 1,
        log: "Konrad",
        pass: "zaq1",
        wiek: 18,
        uczen: "checked",
        plec: "M"
    },
    {
        id: 2,
        log: "Małogrzata",
        pass: "gosia",
        wiek: 12,
        uczen: "",
        plec: "K"
    }, {
        id: 3,
        log: "Witek",
        pass: "qwerty",
        wiek: 15,
        uczen: "",
        plec: "M"
    },
    {
        id: 4,
        log: "Monika",
        pass: "1234",
        wiek: 9,
        uczen: "checked",
        plec: "K"
    },
    {
        id: 5,
        log: "Sylwia",
        pass: "hejkokj",
        wiek: 17,
        uczen: "",
        plec: "K"
    },
    {
        id: 6,
        log: "Staszek",
        pass: "abccds",
        wiek: 11,
        uczen: "checked",
        plec: "M"
    }
]
// Ustawienie folderu statycznego 
app.use(express.static(path.join(__dirname, 'static')))

// Tutaj jest routing 
app.get("/", function (res, require) {
    require.sendFile(__dirname + "/static/html/index.html")
})

app.get("/register", function (res, require) {
    require.sendFile(__dirname + "/static/html/register.html")
})

app.get("/login", function (res, require) {
    require.sendFile(__dirname + "/static/html/login.html")
})

app.get("/admin", function (res, require) {
    loged ? require.sendFile(__dirname + "/static/html/admin.html") : require.sendFile(__dirname + "/Static/html/brak.html")
})


// Kalibracja bodyparsera
app.use(bodyParser.urlencoded({
    extended: true
}))

//rejestracja

app.post('/registratrion', function (req, res) {

    let clone = false

    users.forEach(function (element) {
        if (element.log == req.body.log) {
            clone = true
        }
    })

    if (clone == false) {
        users.push({
            id: users.length + 1,
            log: req.body.log,
            pass: req.body.pass,
            wiek: req.body.wiek,
            uczen: (req.body.uczen ? 'checked' : ''),
            plec: req.body.plec
        })
        res.send(`Witamy ${req.body.log} na stronie `)
    } else {
        res.send('Już istanieje taki użytkownik')
    }
})

//logowanie 
app.post('/login', function (req, res) {
    let correct = false
    users.forEach(function (element) {
        if (element.log == req.body.log && element.pass == req.body.pass) {
            correct = true
        }
    })

    if (correct) {
        loged = true
        res.redirect("/admin")
    } else {
        res.send('Nieprawidłowy login lub hasło')
    }
})

//templatka dla podstorn admina 
let head = `
<head>
    <link rel="stylesheet" href="css/mian.css">
    <link rel="stylesheet" href="css/admin.css">
</head>
`

let nav = `
<body>
<nav class="c-admin">
    <a class="c-admin__link"href="/show">show</a>
    <a class="c-admin__link"href="/gender">gender</a>
    <a class="c-admin__link"href="/sort">sort</a>
</nav>
`



//funkcja show 
app.get('/show', function (req, res) {

    let table = `<table class="c-admin__table">`
    users.forEach(function (element) {
        table += `<tr>`
        table += `<th>id: ${element.id}</th>`
        table += `<th>user: ${element.log} - ${element.pass}</th>`
        table += `<th>wiek: ${element.wiek}</th>`
        table += `<th>uczeń: <input type='checkbox' ${element.uczen} disabled/></th>`
        table += `<th>płeć: ${element.plec}</th>`
        table += `</tr>`
    })

    table += `
        </table> 
    </body>
    `
    let html = head + nav + table

    res.send(html)
})


//gender

app.get('/gender', function (req, res) {

    let table = `<table class="c-admin__table half__th">`
    users.forEach(function (element) {
        if (element.plec == 'K') {
            table += `<tr>`
            table += `<th>id: ${element.id}</th>`
            table += `<th>płeć: ${element.plec}</th>`
            table += `</tr>`
        }
    })

    table += `</table> <table class="c-admin__table half__th">`

    users.forEach(function (element) {
        if (element.plec == 'M') {
            table += `<tr>`
            table += `<th>id: ${element.id}</th>`
            table += `<th>płeć: ${element.plec}</th>`
            table += `</tr>`
        }
    })

    table += `
        </table> 
    </body>
    `

    let html = head + nav + table

    res.send(html)
})

//sort

app.get('/sort', function (req, res) {

    let input = `
    <form action="/sort" method="POST" class = "c-admin__form" onchange="this.submit()">
        <div class="c-admin__radioBox">
            <input type="radio" name="ascending" value="True" id="" class="c-admin__radio" checked> <p>Rosnąco</p> 
            <input type="radio" name="ascending" value="False" id="" class="c-admin__radio"> <p>Malejąco</p>
        </div>
    </form>
    `

    let tempDataBase = users.sort(function (a, b) {
        return parseFloat(a.wiek) - parseFloat(b.wiek);
    })

    let table = `<table class="c-admin__table">`

    tempDataBase.forEach(function (element) {
        table += `<tr>`
        table += `<th>id: ${element.id}</th>`
        table += `<th>user: ${element.log} - ${element.pass}</th>`
        table += `<th>wiek: ${element.wiek}</th>`
        table += `<th>uczeń: <input type='checkbox' ${element.uczen} disabled/></th>`
        table += `<th>płeć: ${element.plec}</th>`
        table += `</tr>`
    })

    let html = head + nav + input + table

    res.send(html)
})


//post sort 
app.post('/sort', function (req, res) {

    let input = `
    <form action="/sort" method="POST" class = "c-admin__form" onchange="this.submit()">
        <div class="c-admin__radioBox">
            <input ${req.body.ascending == "True" ? 'checked ' : ''}type="radio" name="ascending" value="True" id="" class="c-admin__radio"> <p>Rosnąco</p> 
            <input ${req.body.ascending !== "True" ? 'checked ' : ''} type="radio" name="ascending" value="False" id="" class="c-admin__radio"> <p>Malejąco</p>
        </div>
    </form>
    `

    let tempDataBase = req.body.ascending == "True" ? users.sort((a, b) => parseFloat(a.wiek) - parseFloat(b.wiek)) : users.sort((a, b) => parseFloat(b.wiek) - parseFloat(a.wiek))

    let table = `<table class="c-admin__table">`

    tempDataBase.forEach(function (element) {
        table += `<tr>`
        table += `<th>id: ${element.id}</th>`
        table += `<th>user: ${element.log} - ${element.pass}</th>`
        table += `<th>wiek: ${element.wiek}</th>`
        table += `<th>uczeń: <input type='checkbox' ${element.uczen} disabled/></th>`
        table += `<th>płeć: ${element.plec}</th>`
        table += `</tr>`
    })

    let html = head + nav + input + table

    res.send(html)
})

//logout
app.get('/logout', function (req, res) {
    loged = false
    res.redirect("/")
})
//włączenie
app.listen(PORT, function () {

})