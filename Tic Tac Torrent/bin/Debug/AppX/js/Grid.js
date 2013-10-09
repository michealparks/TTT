function Grid(gridElement)
{
    this.cellHtmlElements = [[], [], []];
    this.cellSize = 60;
    this.size = this.cellSize * 3;
    this.onCellTriggered = null;

    this.__construct = function ()
    {
        var _this = this;

        function appendGridCell(x, y)
        {
            var el = document.createElement('div');
            _this.cellHtmlElements[y][x] = el;
            el.gridPoint = [x, y];

            el.onmousedown = function (event)
            {
                if (event.button === 0)
                {
                    if (_this.onCellTriggered === null)
                        return;

                    _this.onCellTriggered(this.gridPoint);
                }
            };

            el.style.cssFloat = 'left';
            el.style.width = _this.cellSize + 'px';
            el.style.height = _this.cellSize + 'px';

            gridElement.appendChild(el);
        }

        for (var y = 0; y < 3; y++)
        {
            for (var x = 0; x < 3; x++)
                appendGridCell(x, y);
        }

        var el = document.createElement('div');
        el.style.clear = 'left';
        gridElement.appendChild(el);

        gridElement.style.position = 'relative';
        gridElement.style.margin = '0 auto';
        gridElement.style.width = this.size + 'px';

        this.reset();
    };

    this._getImageBundleSlice = function (side)
    {
        switch (side)
        {
        case '.':
            return '0 0';
        case 'X':
            return '0 -60px';
        case 'O':
            return '-60px 0';
        default:
            throw "Grid._getImageBundleSlice: unhandled case value '" + side + "'.";
        }
    };

    this.reset = function ()
    {
        this.cells = [];
        for (var y = 0; y < 3; y++)
        {
            this.cells[y] = [];
            for (var x = 0; x < 3; x++)
                this.setCell([x, y], '.');
        }
    };

    this.getCell = function (point)
    {
        return this.cells[point[1]][point[0]];
    };

    this.setCell = function (point, side)
    {
        this.cells[point[1]][point[0]] = side;

        var s = this.cellHtmlElements[point[1]][point[0]].style;
        s.background = Config.imageBundleUrl;
        s.backgroundPosition = this._getImageBundleSlice(side);
    };

    this.__construct();
}
