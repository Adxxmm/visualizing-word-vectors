function Create3DChart(ID, XVectors, YVectors, ZVectors, WordsList, Word, TextWord) {
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

    var Data = [Trace1]

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
        Data.push(Trace2);
    };

    var Layout = {margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    }};
    return Plotly.newPlot(ID, Data, Layout);
};

function VisualizeJs(Dimension, Path, HookID) {    
    this.RenderAll = () => {
        $.getJSON(Path, function(Vectors) {
            if (Dimension === "3D") {
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
                return Create3DChart(HookID, XVectors, YVectors, ZVectors, WordsList);
            }
        });
    };
    this.RenderClosestWordsToVector = (X, Y, Z, ViewDistance) => {
        if (Dimension === "3D") {
            $.getJSON(Path, function(Vectors) {
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
                return Create3DChart(HookID, XVectors, YVectors, ZVectors, WordsList);
            });
        };
    };
    this.RenderClosestWords = (Word, ViewDistance) => {
        $.getJSON(Path, function(Vectors) {
            if (Dimension === "3D") {
                var XVectors = []
                var YVectors = []
                var ZVectors = []
                var WordsList = []
                WordVector = Vectors[Word]
                if (typeof(WordVector) != "undefined") {
                    for (const [key, value] of Object.entries(Vectors)) {
                        if (key != Word && ((Math.abs(WordVector[0] - value[0])) < ViewDistance) && ((Math.abs(WordVector[1] - value[1])) < ViewDistance) && ((Math.abs(WordVector[2] - value[2])) < ViewDistance)) {
                            XVectors.push(value[0]);
                            YVectors.push(value[1]);
                            ZVectors.push(value[2]);
                            WordsList.push(key);
                        };
                    }
                    return Create3DChart(HookID, XVectors, YVectors, ZVectors, WordsList, WordVector, Word);
                };
            };
        });
    }
}