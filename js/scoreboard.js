navigation = {

    currentPage: 1,
    lastPage: 1,

    next: function (page = 1) {
        this.lastPage = this.currentPage
        this.currentPage = this.currentPage + page
        this.reload()
    },
    
    back: function (page = 1) {
        this.lastPage = this.currentPage
        this.currentPage = this.currentPage - page
        this.reload()
    },

    reload: function () {

        switch(this.currentPage) {

            case 1:
                let data = scoreboard.load()
                if (data !== null) {
                    if (translator.options.detectLanguage === "it")
                        $(".last-game").text("Ultima partita il " + data.lastDate + ": " + data.players.join(", "))
                    else
                        $(".last-game").text("Last game on " + data.lastDate + ": " + data.players.join(", "))
                    $(".continue").show()
                }

                $("#screen2").fadeOut(250, () => $("#screen3").fadeOut(250, () => $("#screen1").fadeIn(250)))
                break;

            case 2:
                $("#insert-player-container").empty().append("<div class='insert-player'><input type='text' minlength='1' maxlength='10' class='insert-player-name'><div class='remove-player pressable'><i class='fa-solid fa-trash-can fa-lg'></i></div></div>")

                $("#screen1").fadeOut(250, () => $("#screen3").fadeOut(250, () => $("#screen2").fadeIn(250, () => $("#insert-player-container .insert-player-name").last().focus())))
                break;

            case 3:
                if (this.lastPage === 1) { // CONTINUE
                    scoreboard.data = scoreboard.load()
                } else if (this.lastPage === 2) { // NEW GAME
                    let players = $(".insert-player-name").map((_, name) => $(name).val().trim()).toArray().filter(n => n)

                    scoreboard.clear()
                    scoreboard.data.players = players
                }
                
                scoreboard.data.lastDate = moment().format("DD/MM/YYYY")
                scoreboard.save()
                scoreboard.reload()

                $("#table tr td:empty").first().click()

                $("#screen1").fadeOut(250, () => $("#screen2").fadeOut(250, () => $("#screen3").fadeIn(250, () => $("#addscore-container #addscore").focus())))
                break;

            default:
                this.currentPage = 1; this.lastPage = 1;
                this.reload()
                break;
        }

    }

}

scoreboard = {

    data: {
        players: [],
        scores: [[]],
        lastDate: null
    },

    selected: {
        position: "",
        // value: 0,
        // prevPosition: "",
        prevValue: 0
    },

    save: function () {
        localStorage.setItem("data", JSON.stringify(this.data))
    },
    
    load: function () {
        return JSON.parse(localStorage.getItem("data"))
    },

    clear: function () {
        this.selected = { position: "", prevValue: 0 }
        this.data.scores = [[]]
        $("#addscore").val("")
        $("#table thead, #table tbody").empty()
    },

    reload: function (next) {

        if ($("#table thead tr").length === 0) {
            let players = "<tr><th>#</th>"
            
            this.data.players.forEach (player => {
                players += "<th>" + player + "</th>"
            })

            $("#table thead").append(players + "</tr>")
        }

        for (let i = 0; i < this.data.scores.length; i++) { // se scores: [[0,1], [2,3]] ENTRA length = 2

            const rowexists = $(".row"+i).length === 1

            if (!rowexists) // se non esiste row, la crea
                $("#table tbody").append("<tr class='row"+i+"'><td class='round'>"+(i+1)+"</td></tr>")

            for (let j = 0; j < this.data.players.length; j++) {  // se scores: [[0,1], [2,3]] length = 2 x 2

                if (rowexists)
                    $("td[data-position='" + i + "," + j + "']").text(this.data.scores[i][j])
                else
                    $(".row"+i).append("<td class='col"+j+" data' data-position='"+i+","+j+"'>" + (this.data.scores[i][j] || "") + "</td>")
                
            }

        }

        if (next)
            this.nextSelected()

        $("#table tbody td").removeClass("selected")
        $("td[data-position='" + this.selected.position + "']").addClass("selected")

    },

    nextSelected: function () {

        let x = parseInt(this.selected.position.split(",")[0])
        let y = parseInt(this.selected.position.split(",")[1])
        
        if (y === this.data.players.length - 1) {
            x += 1; y = 0;
        } else
            y += 1

        let nextPosition = x + "," + y
        
        if (x === scoreboard.data.scores.length)
            this.data.scores.push([])
             
        this.reload()

        $("td[data-position='" + nextPosition + "']").click()

        if($(".selected").length)
            $(".selected")[0].scrollIntoView();
             
    }

}

$(".navigate").click((e) => {
    
    let choice = $(e.currentTarget).data().navigate.split(",")[0]
    let pages = parseInt($(e.currentTarget).data().navigate.split(",")[1])
    
    if (choice === "N")
        navigation.next(pages)
    else
        navigation.back(pages)

})

$("#insert-player-container").on("keydown", ".insert-player-name", (e) => {

    if (e.keyCode === 13 || e.keyCode === 9) {
        $("#insert-player-container").append("<div class='insert-player'><input type='text' minlength='1' maxlength='10' class='insert-player-name'><div class='remove-player pressable'><i class='fa-solid fa-trash-can fa-lg'></i></div></div>")
        setTimeout( function() {
            $("#insert-player-container .insert-player-name").last().focus()
        })
    }

})

$("#insert-player-container").on("click", ".remove-player", (e) => {

    if ($(".remove-player").length > 1)
        $(e.currentTarget).parent().remove()

})

$("#restart").click((e) => {
    e.stopPropagation()

    $("#screen0").fadeIn(250)

})

$("#restart-yes").click((e) => {
    e.stopPropagation()

    scoreboard.clear()
    scoreboard.save()
    scoreboard.reload()

    $("#table tr td:empty").first().click()
    $("#screen0").fadeOut(250, () => $("#addscore-container #addscore").focus())

})

$("#screen0, #restart-no").click((e) => {
    e.stopPropagation()

    $("#screen0").fadeOut(250)

})

$("#table tbody").on("click", ".data", function() {

    let position = $(this).data().position
    let prevPosition = (parseInt(position.split(",")[0]) - 1) + "," + position.split(",")[1]
    
    scoreboard.selected = {
        position,
        // value: parseInt($(this).text()) || 0,
        // prevPosition,
        prevValue: parseInt($("td[data-position='" + prevPosition + "']").text()) || 0
    }

    scoreboard.reload()

})

$("#screen3 .signsbtn").on("click", function() {

    if ($(this).hasClass("checked"))
        $(this).removeClass("checked")
    else {
        $(".signsbtn").removeClass("checked")
        $(this).addClass("checked")
    }

})

$("#addscore").on("keydown", function(e) {
    
    if (e.keyCode === 13 && $(".selected").length) {

        let val = parseInt($(this).val()) || 0
        let x = scoreboard.selected.position.split(",")[0]
        let y = scoreboard.selected.position.split(",")[1]
        let sign = $(".checked").length ? $(".checked").data().sign : ""

        if (sign === "+")
            scoreboard.data.scores[x][y] = scoreboard.selected.prevValue + val
        else if (sign === "-")
            scoreboard.data.scores[x][y] = scoreboard.selected.prevValue - val
        else
            scoreboard.data.scores[x][y] = val

        $("#addscore").val("")

        scoreboard.reload(true)
        scoreboard.save()

    }

})

navigation.reload()