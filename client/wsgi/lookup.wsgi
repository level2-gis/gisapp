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
#required paramaters are table and code, category is for filtering results, sample query
#http://localhost/wsgi/lookup.wsgi?table=my_lookup_table&gtype=2&code=1

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

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)

import qwc_connect

def application(environ, start_response):
  request = Request(environ)
  filt = [];

  sql = ""
  errorText = ''
  data = ()

  try:

    table = request.params["table"]
    code = request.params["code"]
    categoryString = ''
    if "category" in request.params:
      categoryString = request.params["category"]
      categoryString = categoryString.strip()

    sql += "SELECT description FROM " + table + " WHERE code="+code

    if categoryString:
      filt.extend(categoryString.split(','))
      filtLength = len(filt)

      #add single quotes
      for i in range(filtLength):
        filt[i] = "'"+filt[i]+"'"

      sql += " AND category IN("+','.join(filt)+")"
  
    #return [sql]

    conn = qwc_connect.getConnection(environ, start_response)
    if conn == None:
      raise NameError('No connection')

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute(sql, data)

    rows = cur.fetchall()

    resultString = ''

    if len(rows) > 0:
      resultString = json.dumps(rows[0][0], ensure_ascii=False).strip('\"')

  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    errorText += 'error: could not execute query, check Apache error log for more info'
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
