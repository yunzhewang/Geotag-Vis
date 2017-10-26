import csv
import json
import numpy as np
from sklearn.cluster import DBSCAN
from scipy.spatial.distance import pdist, squareform
import matplotlib.pyplot as plt


if __name__ == '__main__':
	filename = "2012-12-01.csv"
	directory = "../../data/csv/by_day/"
	geojson_directory = "../../data/geojson/day_in_geojson/2012-12-01.geojson"

	with open(directory+filename) as fr:
		reader = csv.reader(fr)
		reader.next()
		data = list(reader)

		geo_points = []

		for item in data:
			lng = float(item[-3])
			lat = float(item[-2])
			geo_points.append([lng,lat])           # point format: [lng,lat]

		# decide the epscilon
		
		distance_matrix = squareform(pdist(X, (lambda u,v: haversine(u,v))))
		# pair_dist = distance.squareform(pdist(geo_points, 'euclidean'))
		cluster.knn_dist(distance_matrix, 4)



		# Compute DBSCAN
		# calculate min distance between points
		
		# dists = distance.cdist(geo_points, geo_points, 'euclidean')
		# max_dist = np.max(dists)
		# min_dist = np.min(dists)

		# # need to exclude the '-1' label, why????   CHECK all metrics given in the example
		# # use the run.py in /Program folder to decide the parameters
		# db = DBSCAN(eps=0.09, min_samples=100).fit(geo_points)
		# unique_labels = set(db.labels_)
		# count_0 = 0

		# for label in db.labels_:
		# 	if(label==3):
		# 		count_0 += 1

		# print len(unique_labels)

