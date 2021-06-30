#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys, os
from webob import Request
from webob import Response

#os.environ['PYTHONPATH'] = '/usr/share/qgis/python'
#os.environ['LD_LIBRARY_PATH'] = '/usr/lib/qgis'
#need to setup xvfb - https://docs.qgis.org/3.16/en/docs/server_manual/getting_started.html#xvfb
os.environ['DISPLAY'] = ':99'

def application(environ, start_response):

  resultString = u'Python sys.version = %s\n' % repr(sys.version)
  resultString += u'Python sys.prefix = %s\n' % repr(sys.prefix)

  try:
    from qgis.core import QgsApplication, Qgis
  except:
    resultString += str(sys.exc_info())
  else:

    # Supply path to qgis install location
    QgsApplication.setPrefixPath("/usr", True)

    # Create a reference to the QgsApplication.  Setting the
    # second argument to False disables the GUI.
    qgs = QgsApplication([], False)

    # Load providers
    qgs.initQgis()

    # Append the path where processing plugin can be found
    sys.path.append('/usr/share/qgis/python/plugins')

    import processing
    from processing.core.Processing import Processing
    Processing.initialize()

    resultString += u'QGIS %s\n' % Qgis.QGIS_VERSION

    resultString += u'Providers = %s\n' % str(len(qgs.processingRegistry().providers()))
    resultString += u'Algo = %s\n' % str(len(qgs.processingRegistry().algorithms()))

    # Finally, exitQgis() is called to remove the
    # provider and layer registries from memory
    qgs.exitQgis()

  response = Response(resultString,"200 OK",[("Content-type","text/plain; charset=utf-8"),("Content-length", str(len(resultString)) )])
  return response(environ, start_response)
