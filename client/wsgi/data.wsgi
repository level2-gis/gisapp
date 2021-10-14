#!/usr/bin/python
# -*- coding: utf-8 -*-
#table structure for this script to work:
#CREATE TABLE my_lookup_table (
#	id serial PRIMARY KEY,
#	code integer,
#	description text,
#	geom_type integer NOT NULL,
#	category text,
#	CONSTRAINT "uc_my_lookup" UNIQUE (code, geom_type)
#);
#geom_type: 1=point, 2=line, 3=polygon
#
#required paramaters are table and gtype (geom_type), category and query are for filtering results, sample query
#http://localhost/wsgi/data.wsgi?table=my_lookup_table&category=field&gtype=2&query=1234

from __future__ import print_function

import re #regular expression support
import string #string manipulation support
from webob import Request
from webob import Response
import psycopg2 #PostgreSQL DB Connection
import psycopg2.extras #z.b. für named column indexes
import json
import sys
import os
import importlib

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)

def application(environ, start_response):
  request = Request(environ)
  filt = [];

  sql = ""
  data = ()

  try:

    #which connection to load
    connect = "qwc_connect"
    if "connect" in request.params:
      connect = request.params["connect"]

    qwc_connect = importlib.import_module(connect)

    table = request.params["table"]
    gtype = request.params["gtype"]
    categoryString = ''
    if "category" in request.params:
      categoryString = request.params["category"]
      categoryString = categoryString.strip()
  
    queryString = ''
    if "query" in request.params:
      queryString = request.params["query"]
      #strip away leading and trailing whitespaces
      queryString = queryString.strip()

    #todo params check and sanitize
    #if "filter" in request.params:
    #  filterString = request.params["filter"]
    #  if len(filterString) > 0:
    #    #sanitize
    #    if re.search(r"[^A-Za-z,._]", filterString):
    #      print >> environ['wsgi.errors'], "wrong input: %s" % filterString
    #      filt = [] # set empty to have no search table error returned
    #    else:
    #      filt.extend(filterString.split(','))

    sql += "SELECT code, description FROM " + table + " WHERE geom_type="+gtype

    if categoryString:
      filt.extend(categoryString.split(','))
      filtLength = len(filt)

      #add single quotes
      for i in range(filtLength):
        filt[i] = "'"+filt[i]+"'"

      sql += " AND category IN("+','.join(filt)+")"
  
    if queryString:
      #sql += " AND (description ILIKE '%"+query+"%' OR code::text ILIKE '%"+query+"%')"
      sql += " AND (description ILIKE %s"
      data += ("%" + queryString + "%",)
      sql += " OR code::text ILIKE %s)"
      data += ("%" + queryString + "%",)

    sql += " ORDER BY code;"

    #return [sql]

    conn = qwc_connect.getConnection(environ, start_response)
    if conn == None:
      raise NameError('No connection')

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute(sql, data)

    rowData = [];
    rows = cur.fetchall()

    resultString = '{"results": '+json.dumps(rows)+'}'

    #we need to add the name of the callback function if the parameter was specified
    if "cb" in request.params:
      resultString = request.params["cb"] + '(' + resultString + ')'

  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    errorText = b'error: could not execute query, check Apache error log for more info'
    # write exception to the error.log
    print("WSGI ERROR: " + str(exceptionValue), file=sys.stderr)
    response_headers = [('Content-type', 'text/plain; charset=utf-8'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  finally:
    if "conn" in locals():
      if conn:
        conn.close()

  response = Response(resultString,"200 OK",[("Content-type","text/plain; charset=utf-8"),("Content-length", str(len(resultString)) )])
  return response(environ, start_response)
