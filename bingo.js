$(document).ready(function () {
  BingoForm.setup()
})

var BingoForm = {
  tombolaSimulada: false,
  numerosIngresados: [],
  ultimoNumeroRegistrado: null,
  numeroAnterior: null,
  tombolaGirada: false,
  numeroMaximo: 75,
  bingoColumns: 5,
  bingoRow: 5,
  isMouseDown: false,
  isMarked: false,

  generarEncabezadosTablaNumeros: function (maxNumero) {
      var $thead = $('#tablaNumeros thead')
      $thead.empty()

      var $tr = $('<tr>')
      var numerosPorColumna = 10
      for (var i = 0; i < Math.ceil(maxNumero / numerosPorColumna); i++) {
        var inicio = i * numerosPorColumna + 1
        var fin = inicio + numerosPorColumna - 1
        fin = fin > maxNumero ? maxNumero : fin

        $tr.append('<th>' + inicio + '-' + fin + '</th>')
      }
    $thead.append($tr)
  },

  generarTablaBingoDinamica: function (numFilas, numColumnas) {
    var $tabla = $('#tablaBingo tbody')
    $tabla.empty()

    for (var i = 0; i < numFilas; i++) {
      var $fila = $('<tr>')
      for (var j = 0; j < numColumnas; j++) {
        var $celda = $('<td>').text('x')
        $fila.append($celda)
      }
      $tabla.append($fila)
    }
  },

  generarTablaNumeros: function (maxNumero) {
    this.generarEncabezadosTablaNumeros(maxNumero)
    
    var $tabla = $("#tablaNumeros tbody")
    $tabla.empty()
    
    var numerosPorColumna = 10
    var columnas = Math.ceil(maxNumero / numerosPorColumna)
    
    for (var i = 0; i < numerosPorColumna; i++) {
      var $fila = $('<tr>')
      for (var j = 0; j < columnas; j++) {
        var numero = j * numerosPorColumna + i + 1

        if (numero <= maxNumero) {
          $fila.append('<td class="numero" style="color: white;">' + numero + '</td>')
        } else {
          $fila.append('<td class="numero"></td>')
        }
      }
      $tabla.append($fila)
    }
  },

  actualizarUltimoNumeroRegistrado: function () {
    if(ultimoNumeroRegistrado == '[object HTMLSpanElement]' || ultimoNumeroRegistrado == null){
      value = ' N/A'
    }
    else{
      value = ultimoNumeroRegistrado
    }

    $('#ultimoNumeroRegistrado').text(
      value
    )
  },
    
  actualizarNumeroAnterior: function () {
    if(numeroAnterior == '[object HTMLSpanElement]' || numeroAnterior == null){
      value = ' N/A'
    }
    else{
      value = numeroAnterior
    }
    $('#numeroAnterior').text(
      value
    )
  },

  updateNumberFromtable: function(incorrect_number, correct_number){
    if (BingoForm.numerosIngresados.includes(incorrect_number.toString())) {
      if(BingoForm.numerosIngresados.includes(correct_number.toString())){
        BingoForm.swalAlert('info', 'Número ya existe en la tabla')
      }
      else{
        BingoForm.numerosIngresados = BingoForm.numerosIngresados.filter(function(num) {
          return num !== incorrect_number
        })
        $('#tablaNumeros tbody td').each(function () {
          if ($(this).text() === incorrect_number) {
            $(this).css("color", "white")
          }
        })
        BingoForm.addNumberToTable(correct_number)
        BingoForm.swalAlert('success', 'Número actualizado correctamente')
        $('#incorrectNumber').val('')
        $('#correctNumber').val('')
        $('#correctionModal').modal('hide')
      }
    }
    else{
      BingoForm.swalAlert('info', 'Número no encontrado')
    }
  },

  addNumberToTable: function (number) {
    if (BingoForm.numerosIngresados.includes(number.toString())) {
      BingoForm.swalAlert('info', 'Número ya ingresado')
      return
    }

    BingoForm.numerosIngresados.push(number.toString())
    $(".configurarTablasModal").prop("disabled", true)

    $('#tablaNumeros tbody td').each(function () {
      if ($(this).text() === number) {
        $(this).css("color", "black")
        numeroAnterior = ultimoNumeroRegistrado
        ultimoNumeroRegistrado = number
        BingoForm.actualizarUltimoNumeroRegistrado()
        BingoForm.actualizarNumeroAnterior()
      }
    })
  },

  searchOnTable: function (number) {
    var encontrado = false
    var resaltadoClass = 'resaltado'

    $('#tablaNumeros tbody td').each(function () {
    var textColor = $(this).css("color").toLowerCase()
      if ($(this).text() === number && (textColor === 'rgb(0, 0, 0)' || textColor === "black")) {
        encontrado = true
        $(this).addClass(resaltadoClass)
        var cell = $(this)

        setTimeout(function() {
          cell.removeClass(resaltadoClass)
        }, 3000)
      } else {
        $(this).removeClass(resaltadoClass)
      }
    })

    if (!encontrado) {
      BingoForm.swalAlert('info', 'Número no encontrado')
    }
  },

  validarInputs: function(input) {
    valorActual = input.value.replace(/[^0-9]/g, '')

    if (valorActual) {
      var numero = parseInt(valorActual, 10)
      if (numero < 1 || numero > BingoForm.numeroMaximo) {
        valorActual = valorActual.slice(0, -1)
      }
    }

    input.value = valorActual
  },

  validarInputNumerico: function(input, max) {
    var valor = $(input).val()
    var valorNumerico = parseInt(valor, 10)

    if (!valor.match(/^\d+$/) || valorNumerico < 1 || valorNumerico > max) {
      $(input).val(valor.slice(0, -1))
    }
  },

  toggleTombola: function (tombola) {
    if(this.tombolaGirada != true){
      this.tombolaGirada = true
      $("#numeroInput").prop("disabled", true)
      $("#ingresarBtn").prop("disabled", true)
      $("#toggleTombola").prop("disabled", true)
      $('.configurarTablasModal').prop("disabled", true)
      $('#correctNumberButton').prop("disabled", true)
    }

    tombola.prop("disabled", true)

    var modalBody = $('<div class="modal-body circulo-numeros animate__animated animate__zoomIn">')

    var modal = $('<div class="modal" id="tombolaModal" tabindex="-1" role="dialog">')
                .appendTo("body")

    var modalDialog = $('<div class="modal-dialog modal-dialog-centered" role="document">')
                      .appendTo(modal)
                      .addClass("rounded-circle")
                      .css("overflow", "hidden")

    var modalContent = $('<div class="modal-content tombola-content">')
                       .appendTo(modalDialog)
                       .append(modalBody)

    var remainingNumbers = Array.from({ length: BingoForm.numeroMaximo }, (_, i) => i + 1)

    var numeroInterval = setInterval(function () {
      if (remainingNumbers.length === 0) {
        clearInterval(numeroInterval)
        setTimeout(function () {
          var selectedNumber = parseInt(modalBody.text())
          $("#tombolaNumber").prop("disabled", false)
          BingoForm.addNumberToTable(selectedNumber.toString())
          modal.modal('hide')
        }, 3000)
      } else {
        remainingNumbers = remainingNumbers.filter(num => BingoForm.numerosIngresados.indexOf(num.toString()) === -1)

        if (remainingNumbers.length > 0) {
          var randomIndex = Math.floor(Math.random() * remainingNumbers.length)
          var selectedNumber = remainingNumbers.splice(randomIndex, 1)[0]

          modalBody.text(selectedNumber).css("font-size", "10em")
        }
     }
    }, 3)

    modal.modal({
      backdrop: 'static',
      keyboard: false
    })
  },

  toggleTombolabutton: function () {
    $('.numeroInput').toggle()
    $('#ingresarBtn').toggle()
    $('#tombolaNumber').toggle()
    $('#correctNumberButton').toggle()
    this.updateTextOnToggle()
  },

  updateTextOnToggle: function () {
    if ($('#tombolaNumber').is(':visible')) {
      $('#toggleTombola').text('Ingresar Número').css('font-weight', 'bold')
      $('.numero_label').text('Simular Tómbola:').css('font-weight', 'bold')
    } else {
      $('#toggleTombola').text('Simular Tómbola').css('font-weight', 'bold')
      $('.numero_label').text('Ingresar Número:').css('font-weight', 'bold')
    }
  },

  resetGame: function () {
    BingoForm.numerosIngresados = []
    ultimoNumeroRegistrado = null
    numeroAnterior = null
    tombolaGirada = false

    BingoForm.actualizarUltimoNumeroRegistrado()
    BingoForm.actualizarNumeroAnterior()

    $("#numeroInput").prop("disabled", false)
    $("#ingresarBtn").prop("disabled", false)
    $("#toggleTombola").prop("disabled", false)
    $("#tombolaNumber").prop("disabled", false)
    $('.configurarTablasModal').prop("disabled", false)
    $('#correctNumberButton').prop("disabled", false)

    $('#numeroInput').val("")
    $('#buscarInput').val("")

    if ($('#tombolaNumber').is(':visible')) {
      $('#toggleTombola').click()
    }

    this.updateTextOnToggle()

    BingoForm.generarTablaNumeros(BingoForm.numeroMaximo)
    BingoForm.generarTablaBingoDinamica(BingoForm.bingoRow, BingoForm.bingoColumns)
  },

  updateTables: function(numeroMaximo, filasBingo, columnasBingo){
    if(numeroMaximo && filasBingo && columnasBingo) {
      BingoForm.numeroMaximo = parseInt(numeroMaximo)
      BingoForm.generarTablaNumeros(parseInt(numeroMaximo))
      BingoForm.generarTablaBingoDinamica(parseInt(filasBingo), parseInt(columnasBingo))
    }

    $('#configurarTablasModal').modal('hide')
  },

  swalAlert: function(icon, title) {
    Swal.fire({
      icon: icon,
      title: title,
    })
  },

  setup: function () {
    $('.update_tables').on('click', function (e) {
      e.preventDefault()
      var numeroMaximo = $('#numeroMaximo').val()
      var filasBingo = $('#filasBingo').val()
      var columnasBingo = $('#columnasBingo').val()

      if(numeroMaximo != '' && filasBingo != '' && columnasBingo != '' ){
        BingoForm.numeroMaximo = numeroMaximo
        BingoForm.bingoRow = filasBingo
        BingoForm.bingoColumns = columnasBingo
        BingoForm.updateTables(numeroMaximo, filasBingo, columnasBingo)
      }
      else{
        BingoForm.swalAlert('info', 'Debe ingresar todos los valores')
      }
    })

    BingoForm.generarTablaBingoDinamica(BingoForm.bingoRow, BingoForm.bingoColumns)
    BingoForm.generarTablaNumeros(BingoForm.numeroMaximo)
    BingoForm.actualizarUltimoNumeroRegistrado()
    BingoForm.actualizarNumeroAnterior()
    $('#configurarTablasModal').modal('hide')

    window.addEventListener('beforeunload', function (event) {
      event.preventDefault()
      var message = '¿Seguro que quieres abandonar la página?'
      event.returnValue = message
      return message
    })

    $('#tombolaNumber').hide()

    $("#ingresarBtn").on("click", function () {
      var inputNumber = $("#numeroInput").val()
      if(inputNumber != ''){
        BingoForm.addNumberToTable(inputNumber)
        $("#numeroInput").val('')
      }
    })

    $("#buscarBtn").on("click", function () {
      var searchNumber = $("#buscarInput").val()
      if(searchNumber != ''){
        BingoForm.searchOnTable(searchNumber)
        $("#buscarInput").val('')
      }
    })

    $("#numeroInput").on("keypress", function (e) {
      if (e.which === 13) {
        $("#ingresarBtn").click()
      }
    })

    $("#buscarInput").on("keypress", function (e) {
      if (e.which === 13) {
        $("#buscarBtn").click()
      }
    })

    $("#numeroInput, #buscarInput, #incorrectNumber, #correctNumber").on("input", function() {
      BingoForm.validarInputs(this)
    })

    $('#toggleTombola').on('click', function () {
      BingoForm.toggleTombolabutton()
    })

    $("#tombolaNumber").on("click", function () {
      BingoForm.toggleTombola($(this))
    })

    $('#numeroMaximo').on('input', function() {
      BingoForm.validarInputNumerico(this, 100)
    })
    
    $('#filasBingo').on('input', function() {
      BingoForm.validarInputNumerico(this, 10)
    })
    
    $('#columnasBingo').on('input', function() {
      BingoForm.validarInputNumerico(this, 10)
    })

    $('#correctNumberButton').on('click', function() {
      $('#correctNumberModal').show()
    })

    $('#submitCorrection').on('click', function() {
      var incorrectNumber = $('#incorrectNumber').val()
      var correctNumber = $('#correctNumber').val()

      if(incorrectNumber == '' && correctNumber == '') {
        BingoForm.swalAlert('info', 'Debe llenar ambos campos')
      } else if(incorrectNumber == ''){
        BingoForm.swalAlert('info', 'Número incorrecto vacío')
      } else if(correctNumber == '') {
        BingoForm.swalAlert('info', 'Número correcto vacío')
      } else {
        BingoForm.updateNumberFromtable(incorrectNumber, correctNumber)
      }
    })

    $("#resetGame").on("click", function () {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto reiniciará el juego y perderás el progreso actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          BingoForm.resetGame()
        }
      })
    })

    $('#tablaBingo').on('mousedown', 'td:not(.casilla-central)', function () {
      BingoForm.isMouseDown = true
      BingoForm.isMarked = $(this).hasClass('marcada')
      if (BingoForm.isMarked) {
        $(this).removeClass('marcada')
      } else {
        $(this).addClass('marcada')
      }
      return false
      })

    $(document).on('mouseup', function () {
      BingoForm.isMouseDown = false
    })

    $('#tablaBingo').on('mousemove', 'td:not(.casilla-central)', function () {
      if (BingoForm.isMouseDown) {
        if (BingoForm.isMarked) {
          $(this).removeClass('marcada')
        } else {
          $(this).addClass('marcada')
        }
      }
    })

    $('#tablaBingo').on('dragstart', function (event) {
      event.preventDefault()
    })
  }
}