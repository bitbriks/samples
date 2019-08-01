# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import json

class Todo(http.Controller):
    @http.route('/todo/todo/', auth='public')
    def index(self, **kw):
        context = {
            'session_info': json.dumps(request.env['ir.http'].session_info())
        }
        return request.render('todo.index', qcontext=context)

    @http.route('/todo/todo/objects/', auth='public')
    def list(self, **kw):
        return http.request.render('todo.listing', {
            'root': '/todo/todo',
            'objects': http.request.env['todo.todo'].search([]),
        })

    @http.route('/todo/todo/objects/<model("todo.todo"):obj>/', auth='public')
    def object(self, obj, **kw):
        return http.request.render('todo.object', {
            'object': obj
        })