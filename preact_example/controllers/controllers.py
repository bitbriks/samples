# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import json

# class BeollaExam(http.Controller):
#     @http.route('/quizzes/admin', auth='public')
#     def index(self, **kw):
#         context = {
#             'session_info': json.dumps(request.env['ir.http'].session_info())
#         }
#         return request.render('beolla_exam.index', qcontext=context)

#     @http.route('/beolla_exam/beolla_exam/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('beolla_exam.listing', {
#             'root': '/beolla_exam/beolla_exam',
#             'objects': http.request.env['beolla_exam.beolla_exam'].search([]),
#         })

#     @http.route('/beolla_exam/beolla_exam/objects/<model("beolla_exam.beolla_exam"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('beolla_exam.object', {
#             'object': obj
#         })