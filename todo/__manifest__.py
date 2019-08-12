# -*- coding: utf-8 -*-
{
    'name': "todo",

    'summary': """
        Demo single page application for Odoo using ReactJS""",

    'description': """
        Demo single page application for Odoo using ReactJS
    """,

    'author': "Beolla",
    'website': "https://beolla.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/12.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Administration',
    'version': '0.3',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}