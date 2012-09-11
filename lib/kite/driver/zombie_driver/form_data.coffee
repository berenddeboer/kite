fs            = require "fs"
Path          = require "path"
Mime          = require "mime"

class FormData extends Array

  constructor: (formElement) ->
    super()
    inputs = formElement.ownerDocument.evaluate("//input", formElement).value
    for input in inputs
      switch input.type
        when "string"
          @push [input.name, input.value]
        when "file"
          file = @_makeUploadedFile input.value
          @push [input.name, file]
        else
          # see https://github.com/assaf/zombie/blob/master/lib/zombie/forms.coffee#L36
          throw new Error "Unknown input type \"#{input.type}\""

  _makeUploadedFile: (fileName) ->
    file          = new String Path.basename fileName
    file.filename = fileName
    file.mime     = Mime.lookup fileName
    file.read     = ->
      fs.readFileSync fileName
    file

module.exports.FormData = FormData
