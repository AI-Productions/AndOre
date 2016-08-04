//load app.js after this!
//using (from app.js) id, CallCallback

// RobG - http://stackoverflow.com/a/12690148
/* Only works for native objects, host objects are not
** included. Copies Objects, Arrays, Functions and primitives.
** Any other type of object (Number, String, etc.) will likely give
** unexpected results, e.g. copy(new Number(5)) ==> 0 since the value
** is stored in a non-enumerable property.
**
** Expects that objects have a properly set *constructor* property.
*/
function copy(source, deep) {
   var o, prop, type;

  if (typeof source != 'object' || source === null) {
    // What do to with functions, throw an error?
    o = source;
    return o;
  }

  o = new source.constructor();

  for (prop in source) {

    if (source.hasOwnProperty(prop)) {
      type = typeof source[prop];

      if (deep && type == 'object' && source[prop] !== null) {
        o[prop] = copy(source[prop]);

      } else {
        o[prop] = source[prop];
      }
    }
  }
  return o;
}

//called by app.js after id is populated, etc
var worldViewSelector = "#worldview";
var inventorySelector = "#inventory";

var firstTime = true;
var createRowID = function(row) {
    return "world_row" + row;
};
var createColumnID = function(col) {
    return "world_col" + col;
};

var createCellID = function(row, col) {
    return "world_row" + row + "world_col" + col;
};

View = function() {

};

View.prototype = {
  worldView: null,
  inventoryView: null,
  playerStatView: {
    currentHealth: null,
    healthCap: null,
    attackPower: null
  },
  pollDelay: 350,
  SetupView : function(app, callback) {
    this.app = app;
    this.worldView = $(worldViewSelector);
    this.inventoryView = $(inventorySelector);
    this.playerStatView.currentHealth = $("#statHealth");
    this.playerStatView.healthCap = $("#statHealthCap");
    this.SetupInput();
    this.Poll();
    CallCallback(callback);
  },
  DrawInventory: function(inventory) {
    if (inventory == '') {
      return false;
    }

    this.inventoryView.text(inventory);
  },
  DrawWorldView: function(world) {
    if (world == '') {
      return false;
    }

    var rows = world.length;
    var cols = world[0].length;

    if (firstTime) {
      firstTime = false;

      for (var rowNum = 0; rowNum < rows; rowNum++) {
        // Creating the row div
        $(worldViewSelector).append('<div class="world_row" id="' + createRowID(rowNum) + '"></div>');

        for (var colNum = 0; colNum < cols; colNum++) {
          var cellSelector = '#' + createCellID(rowNum, colNum);
          // Creating the cell
          //console.log(createCellID(rowNum, colNum));
          if (world[rowNum][colNum].length == 2) {
            // Icon is using new format
            $('#' + createRowID(rowNum)).append('<div class="cell" id="' + createCellID(rowNum, colNum) + '">' + world[rowNum][colNum][0] + '</div>');
            $(cellSelector).css('color', world[rowNum][colNum][1]);
          } else {
            $('#' + createRowID(rowNum)).append('<div class="cell" id="' + createCellID(rowNum, colNum) + '">' + world[rowNum][colNum] + '</div>');
          }
        }
      }
    } else {
      //console.log("Updating world");
      for (var rowNum = 0; rowNum < rows; rowNum++) {
        for (var colNum = 0; colNum < cols; colNum++) {
          var cellSelector = '#' + createCellID(rowNum, colNum);
          if (world[rowNum][colNum].length == 2) {
            // Icon is using new format
            $(cellSelector).html(world[rowNum][colNum][0]);
            $(cellSelector).css('color', world[rowNum][colNum][1]);
          } else {
            $('#' + createCellID(rowNum, colNum)).html(world[rowNum][colNum]);
          }
        }
      }
    }
  },
  DrawPlayerStats: function(stats) {
    if (stats == '') {
      return false;
    }

    this.playerStatView.currentHealth.text(stats.health);
    this.playerStatView.healthCap.text(stats.health_cap);
  },
  Draw: function(data){
    var world_json = copy(data.world);
    world_json.pop();

    this.DrawWorldView(world_json);
    this.DrawInventory(data.inventory);
    this.DrawPlayerStats(data.vitals);
  },
  Poll: function(){
    setTimeout(function() {
      //console.log(typeof(View.prototype.Poll));
      app.GetDisplay(View.prototype.Poll, this.pollDelay);
    }, this.pollDelay);
  },
  SetupInput: function() {
    $("body").keypress(function(e){
      command = String.fromCharCode(e.which).toLowerCase();
      //console.log(app.actionsLut);
      if(app.actionsLut[command]) {
        app.SendCommand(command);
      }
    });

  }
}
