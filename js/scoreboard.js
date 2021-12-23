scoreboard = {

    data: {
        players: ["luca", "paolo", "marco"],
        scores: [[]]
        // scores: [[2,5,6], [3,8,10], [12,20,18]]
    },

    selected: {
        position: "",
        value: 0,

        prevPosition: "",
        prevValue: 0
    },

    save: function () {
        // let data = JSON.stringify(sb)
        // JSON.parse(data)
    },

    load: function () {

    },

    clear: function () {
        this.selected.position = "";
        this.selected.value = 0;
        this.data.scores = [[]];
        $("#table tbody").empty();
    },

    reload: function (next) {

        if ($("#table thead tr").length === 0) {
            let players = "<tr><th>#</th>"
            
            this.data.players.forEach (player => {
                players += "<th>" + player + "</th>"
            });

            $("#table thead").append(players + "</tr>");
        }


        for (let i = 0; i < this.data.scores.length; i++) { // se scores: [[0,1], [2,3]] ENTRA length = 2

            const rowexists = $(".row"+i).length === 1

            if (!rowexists) // se non esiste row, la crea
                $("#table tbody").append("<tr class='row"+i+"'><td class='round'>"+(i+1)+"</td></tr>")

            for (let j = 0; j < this.data.players.length; j++) {  // se scores: [[0,1], [2,3]] length = 2 x 2

                if (rowexists) {
                    $("td[data-position='" + i + "," + j + "']").text(this.data.scores[i][j])
                } else {
                    $(".row"+i).append("<td class='col"+j+" data' data-position='"+i+","+j+"'>" + (this.data.scores[i][j] || "") + "</td>")
                }
                
            }

        }

        // if (this.selected.position !== "") {
        // }
            
        if (next)
            this.nextSelected()

        $("#table tbody td").removeClass("selected")
        $("td[data-position='" + this.selected.position + "']").addClass("selected")
    },

    nextSelected: function () {
        let x = parseInt(this.selected.position.split(',')[0]);
        let y = parseInt(this.selected.position.split(',')[1]);
        
        if (y === this.data.players.length - 1) {
            x += 1; y = 0;
        } else
            y += 1;

        let nextPosition = x + "," + y;
        
        if (x === scoreboard.data.scores.length)
            this.data.scores.push([]);
             
        this.reload();

        $("td[data-position='" + nextPosition + "']").click();
             
    }

}

scoreboard.reload()

$("#table tbody").on("click", ".data", function(e) {

    let position = $(this).data().position;
    let prevPosition = (parseInt(position.split(',')[0]) - 1) + "," + position.split(',')[1]
    
    scoreboard.selected = {
        position,
        value: parseInt($(this).text()) || 0,
        prevPosition,
        prevValue: parseInt($("td[data-position='" + prevPosition + "']").text()) || 0
    }
        
    scoreboard.reload()

});

$(".signsbtn").on("click", function(e) {
    if ($(this).hasClass("checked"))
        $(this).removeClass("checked");
    else {
        $(".signsbtn").removeClass("checked");
        $(this).addClass("checked");
    }
})

$("#addscore").on("keydown", function (e) {
    
    if (e.keyCode === 13 && $(".selected").length) {

        let val = parseInt($(this).val()) || 0
        let x = scoreboard.selected.position.split(',')[0]
        let y = scoreboard.selected.position.split(',')[1]

        if ($(".checked").val() === "+") {
            scoreboard.data.scores[x][y] = scoreboard.selected.prevValue + val
        } else if ($(".checked").val() === "-") {
            scoreboard.data.scores[x][y] = scoreboard.selected.prevValue - val
        } else {
            scoreboard.data.scores[x][y] = val
        }

        $("#addscore").val("")

        scoreboard.reload(true)
    }

});