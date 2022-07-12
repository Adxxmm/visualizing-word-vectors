# visualizing-word-vectors
Systems that can visualize word embedding vectors in 3D and 2D spaces.

## Choosing 3D or 2D
3D and 2D can be represented in a chart. Enabling this requires the use of simple Javascript.

## Generating 3D vectors from an [nltk corpus](https://www.nltk.org/api/nltk.corpus.html)

## Understanding the system
### Data
Word vectors are stored in a ``.json`` file such as the provided [3D vectors](static\corpora\3DVectors.json) file. Each json contains a word as a key, and the dimensions as values.

```json
{
    "in": [
        2.0589427947998047, // X
        -0.4056415557861328, // Y
        -35.34573745727539 // Z (If 3D charts are enabled)
    ]
}
```

### The program itself
The program converts multi-dimensional word vectors into 2D or 3D by using [t-SNE](https://scikit-learn.org/stable/modules/generated/sklearn.manifold.TSNE.html). There is a [helpful video](https://youtu.be/NEaUSP4YerM?t=79) on how t-SNE converts these dimensions.

These dimensions are then projected onto [plot.ly](https://plotly.com/javascript/) or [chartjs](https://www.chartjs.org/) plots.