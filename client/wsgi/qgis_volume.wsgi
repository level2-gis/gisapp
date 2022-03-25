#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys, os
from webob import Request
from webob import Response

os.environ['PYTHONPATH'] = '/usr/share/qgis/python'
os.environ['LD_LIBRARY_PATH'] = '/usr/lib/qgis'
#need to setup xvfb - https://docs.qgis.org/3.16/en/docs/server_manual/getting_started.html#xvfb
os.environ['DISPLAY'] = ':99'

def application(environ, start_response):

  request = Request(environ)
  resultString = ''

  try:
    project_name = request.params["project"]
    raster_id = request.params["raster"]
    polygon_id = request.params["polygon"]
    feature_id = request.params["feature_id"]
    baselevel = request.params["baselevel"]

    from qgis.core import (
        QgsProject,
        QgsPathResolver,
        QgsApplication,
        QgsProcessing,
        QgsProcessingUtils,
        QgsProcessingFeedback,
        Qgis
    )
    #needed in QGIS 3.4
    #from qgis.analysis import QgsNativeAlgorithms


    # Supply path to qgis install location
    QgsApplication.setPrefixPath("/usr", True)

    qgs = QgsApplication([], False)
    qgs.initQgis()

    # Append the path where processing plugin can be found
    sys.path.append('/usr/share/qgis/python/plugins')

    project = QgsProject.instance()
    project.read('/home/GEO-PORTAL/projects/vol_calc.qgs')
    layers = project.mapLayers()

    raster = layers.get(raster_id)
    if raster is None:
      raise Exception('Raster is none: '+raster_id)

    polygon = layers.get(polygon_id)
    if polygon is None:
      raise Exception('Polygon is none: '+polygon_id)

    crs = polygon.sourceCrs()

    # START PROCESSING
    import processing
    from processing.core.Processing import Processing
    Processing.initialize()
    #needed in QGIS 3.4
    #QgsApplication.processingRegistry().addProvider(QgsNativeAlgorithms())

    feedback = QgsProcessingFeedback()

    # CLIP RASTER
    clip_raster_file = QgsProcessingUtils.generateTempFilename(raster.name()) + '.tif'
    alg_params = {
            'ALPHA_BAND': False,
            'CROP_TO_CUTLINE': True,
            'DATA_TYPE': 0,
            'EXTRA': '',
            'INPUT': raster,
            'KEEP_RESOLUTION': False,
            'MASK': polygon,
            'MULTITHREADING': False,
            'NODATA': None,
            'OPTIONS': '',
            'SET_RESOLUTION': False,
            'SOURCE_CRS': crs,
            'TARGET_CRS': crs,
            'X_RESOLUTION': None,
            'Y_RESOLUTION': None,
            'OUTPUT': clip_raster_file
        }
    clip_raster = processing.run('gdal:cliprasterbymasklayer', alg_params, feedback=feedback, is_child_algorithm=True)
    #clip_raster = processing.run('qgis:union', alg_params, feedback=feedback, is_child_algorithm=True)


    # CUT VOLUME
    alg_params = {
        'BAND': 1,
        'INPUT': clip_raster['OUTPUT'],
        'LEVEL': baselevel,
        'METHOD': 0
        #'OUTPUT_TABLE': 'memory:' #QgsProcessing.TEMPORARY_OUTPUT #parameters['volume_table']
    }

    cut_volume = processing.run('native:rastersurfacevolume', alg_params, feedback=feedback, is_child_algorithm=True)

    resultString += 'OK ' + clip_raster_file + ' ' + cut_volume['VOLUME']

    qgs.exitQgis()

  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    errorText = b'error: could not execute query, check Apache error log for more info'
    # write exception to the error.log
    exceptionString = "WSGI ERROR: " + str(exceptionValue)
    print(exceptionString, file=sys.stderr)
    response_headers = [('Content-type', 'text/plain; charset=utf-8'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  response = Response(resultString,"200 OK",[("Content-type","text/plain; charset=utf-8"),("Content-length", str(len(resultString)) )])
  return response(environ, start_response)
