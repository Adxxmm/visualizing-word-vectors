from sklearn.manifold import TSNE
from gensim.models import Word2Vec
from nltk.corpus import brown
from scipy import spatial
import sys
import os
import json
import numpy

class Model:
    def __init__(self, corpus=None, dimensions=2):
        print("Creating model... (this may take a while)", file=sys.stderr)
        if corpus is None:
            with open("static\MDVectors.json", "r") as f:
                self.Vectors = json.load(f)
                self.Vocabulary = {}
                self.VectorsReduced = TSNE(n_components=dimensions).fit_transform(numpy.array(list(self.Vectors.values())))
                for i, v in enumerate(self.Vectors):
                    self.Vocabulary[v] = i
        else:
            self.Corpus = Word2Vec(brown.sents()).wv
            self.Vocabulary = self.Corpus.key_to_index
            self.Vectors = self.Corpus[self.Vocabulary]

            self.VectorsReduced = TSNE(n_components=dimensions).fit_transform(self.Vectors)

        print("Model finished", file=sys.stderr)

    def GetReducedVectors(self):
        ListedVectors = self.VectorsReduced.tolist()
        NewDict = {}
        for i in range(len(ListedVectors)-1):
            NewDict[[*self.Vocabulary.keys()][i]] = ListedVectors[i]

        return NewDict

    def GenerateVectorsFile(self, Path):
        with open(Path,"x", encoding='utf-8') as f:
            json.dump(self.GetVectors(), f, ensure_ascii=False, indent=4)
            f.close()

def GetCosineSimilarity(Vector1, Vector2):
    return (1 - spatial.distance.cosine(Vector1, Vector2))*100