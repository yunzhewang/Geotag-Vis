from flask import Flask, render_template, request, jsonify
from flask import Response
import numpy as np
from sklearn.cluster import DBSCAN
import random
import json
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper
from scipy.spatial.distance import pdist, squareform
# from math import radians, cos, sin, asin, sqrt

def haversine(lonlat1, lonlat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lat1, lon1 = lonlat1
    lat2, lon2 = lonlat2
    lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator
    

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route('/geo_map.html')
def geo_map():
    return render_template('geo_map.html')

@app.route('/clustering')
@crossdomain(origin='*')
def clustering():    
    points = request.args.get('points')
    points = json.loads(points)
    t = str(type(points))        # list?

    test_points = points[:500]
    # b = request.args.get('b', 0, type=float)
    distance_matrix = squareform(pdist(test_points, (lambda u,v: haversine(u,v))))
    db = DBSCAN(eps=0.2, min_samples=20, metric='precomputed').fit(distance_matrix)
    m = db.labels_
    num = set(m)
    # serialization
    cluster_list = []
    if(-1 not in num):
        for l in range(0, len(num)):
            cluster_list.append([])
    else:
        for l in range(0, len(num)-1):
            cluster_list.append([])

    for label, point in zip(m, points):
        label = int(label)
        if(label!=-1):
            cluster_list[label].append(point)

    return jsonify(result=cluster_list)



if __name__ == "__main__":
    # app.run(debug=True)

    # customize the ip and port
    app.run(
        host="0.0.0.0",
        port=int("6699"),
        debug=True
    )