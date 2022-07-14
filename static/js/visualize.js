class Create3DChart {
    constructor(ID, XVectors, YVectors, ZVectors, WordsList, Word, TextWord) {
        var self = this;

        this.ID = ID;
        var Trace1 = {
            x: XVectors,
            y: YVectors,
            z: ZVectors,
            text: WordsList,
            mode: 'markers+text',
            marker: {
                size: 12,
                line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5},
                opacity: 0.8},
            type: 'scatter3d'
        };

        this.Data = [Trace1]

        if (typeof(Word) != "undefined" && typeof(TextWord) != "undefined") {
            var Trace2 = {
                x: [Word[0]],
                y: [Word[1]],
                z: [Word[2]],
                text: [TextWord],
                mode: 'markers+text',
                marker: {
                    color: 'rgb(0, 127, 0)',
                    size: 12,
                    symbol: 'circle',
                    line: {
                    color: 'rgb(204, 204, 204)',
                    width: 1},
                    opacity: 0.8},
                type: 'scatter3d'
            };
            self.Data.push(Trace2);
        };

        this.Layout = {margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        }};

        this.Plot = Plotly.newPlot(ID, this.Data, this.Layout);
    };

    AddUniqueWord(CustomWord, Color) {
        var UniqueTrace = {
            x: [CustomWord.X],
            y: [CustomWord.Y],
            z: [CustomWord.Z],
            text: [CustomWord.Text],
            mode: 'markers+text',
            marker: {
                color: Color,
                size: 12,
                symbol: 'circle',
                line: {
                color: 'rgb(204, 204, 204)',
                width: 1},
                opacity: 0.8},
            type: 'scatter3d'
        }

        this.Data.push(UniqueTrace);

        Plotly.purge(this.ID);
        this.Plot = Plotly.newPlot(this.ID, this.Data, this.Layout);
    }
};

class VisualizeJs {
    constructor(Dimension, Path, HookID) {
        this.Dimension = Dimension;
        this.Path = Path;
        this.HookID = HookID;
    }
    GetVectors(_callback) {
        $.getJSON(this.Path, _callback);
    }
    CreateEmptyChart() {
        var self = this;
        self.Chart = new Create3DChart(self.HookID, [], [], [], []);
        return self.Chart;
    }
    RenderAll() {
        var self = this;
        $.getJSON(this.Path, function(Vectors) {
            if (self.Dimension === "3D") {
                var XVectors = []
                var YVectors = []
                var ZVectors = []
                var WordsList = []
                for (const [key, value] of Object.entries(Vectors)) {
                    XVectors.push(value[0]);
                    YVectors.push(value[1]);
                    ZVectors.push(value[2]);
                    WordsList.push(key);
                }
                self.Chart = new Create3DChart(self.HookID, XVectors, YVectors, ZVectors, WordsList);
            }
        });
    };
    RenderClosestWordsToVector(X, Y, Z, ViewDistance) {
        var self = this;
        if (this.Dimension === "3D") {
            $.getJSON(this.Path, function(Vectors) {
                var XVectors = []
                var YVectors = []
                var ZVectors = []
                var WordsList = []
                for (const [key, value] of Object.entries(Vectors)) {
                    if (((Math.abs(X - value[0])) < ViewDistance) && ((Math.abs(Y - value[1])) < ViewDistance) && ((Math.abs(Z - value[2])) < ViewDistance)) {
                        XVectors.push(value[0]);
                        YVectors.push(value[1]);
                        ZVectors.push(value[2]);
                        WordsList.push(key);
                    };
                }
                self.Chart = new Create3DChart(self.HookID, XVectors, YVectors, ZVectors, WordsList);
            });
        };
    };
    RenderClosestWords(Word, ViewDistance) {
        var self = this;
        $.getJSON(this.Path, function(Vectors) {
            if (this.Dimension == "3D") {
                var XVectors = []
                var YVectors = []
                var ZVectors = []
                var WordsList = []
                var WordVector = Vectors[Word]
                if (typeof(WordVector) != "undefined") {
                    for (const [key, value] of Object.entries(Vectors)) {
                        if (key != Word && ((Math.abs(WordVector[0] - value[0])) < ViewDistance) && ((Math.abs(WordVector[1] - value[1])) < ViewDistance) && ((Math.abs(WordVector[2] - value[2])) < ViewDistance)) {
                            XVectors.push(value[0]);
                            YVectors.push(value[1]);
                            ZVectors.push(value[2]);
                            WordsList.push(key);
                        };
                    }
                    self.Chart = new Create3DChart(self.HookID, XVectors, YVectors, ZVectors, WordsList, WordVector, Word);
                };
            };
        });
        return this;
    }
    DisplayWords(CustomWords) {
        var self = this;
        self.Chart = self.CreateEmptyChart();
        $.getJSON(this.Path, function(Vectors) {
            if (self.Dimension === "3D") {
                for (const [key, value] of Object.entries(Vectors)) {
                    for (var i in CustomWords) {
                        if (key == CustomWords[i].Text) {
                            console.log(CustomWords[i].X, CustomWords[i].Y, CustomWords[i].Z);
                            self.Chart.AddUniqueWord(CustomWords[i], CustomWords[i].Color);
                        };
                    };
                };
            };
        });
    }
    ClearPlot() {
        Plotly.purge(this.HookID);
    }
}

class Word {
    constructor(Vectors, Text, Color) {
        this.Vectors = Vectors;
        this.Text = Text;
        this.Color = Color;
        for (const [key, value] of Object.entries(this.Vectors)) {
            if (key === Text) {
                this.X = value[0];
                this.Y = value[1];
                this.Z = value[2];
                break;
            };
        };
        this.Color = Color;
    };
}