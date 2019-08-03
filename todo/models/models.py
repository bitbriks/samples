# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.addons.base.models.assetsbundle import AssetsBundle, JavascriptAsset, CompileError
from collections import OrderedDict
from subprocess import Popen, PIPE
from odoo.tools import misc
import logging
_logger = logging.getLogger(__name__)

class todo(models.Model):
    _name = 'todo.todo'
    name = fields.Char(string='Content')
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         self.value2 = float(self.value) / 100

class BabelJavascriptAsset(JavascriptAsset):
    """TODO: override content"""
    def get_command(self):
        return ['babel', '--presets=/usr/lib/node_modules/babel-preset-react']

    def compile(self, source):
        command = self.get_command()
        try:
            compiler = Popen(command, stdin=PIPE, stdout=PIPE,
                             stderr=PIPE)
        except Exception:
            raise CompileError("Could not execute command %r" % command[0])

        (out, err) = compiler.communicate(input=source.encode('utf-8'))
        if compiler.returncode:
            cmd_output = misc.ustr(out) + misc.ustr(err)
            if not cmd_output:
                cmd_output = u"Process exited with return code %d\n" % compiler.returncode
            raise CompileError(cmd_output)
        return out.decode('utf8')

    # def to_node(self):
    #     if self.url:
    #         return ("script", OrderedDict([
    #             ["type", "text/javascript"],
    #             ["src", self.html_url],
    #         ]), None)
    #     else:
    #         return ("script", OrderedDict([
    #             ["type", "text/javascript"],
    #             ["charset", "utf-8"],
    #         ]), self.with_header())

class AssetsBundleBabel(AssetsBundle):

    def __init__(self, name, files, remains=None, env=None):
        super(AssetsBundleBabel, self).__init__(name, files, remains=remains, env=env)
        for idx, js in enumerate(self.javascripts):
            if js.url.endswith('.jsx'):
                self.javascripts[idx] = BabelJavascriptAsset(self, url=js.url, filename=js._filename, inline=js.inline)

    def transpile_babel(self):
        """run babel to transpile jsx and minify"""
        def handle_compile_error(e, source):
            error = self.get_preprocessor_error(e, source=source)
            _logger.warning(error)
            self.css_errors.append(error)
            return ''

        if self.javascripts:
            need_transpile = [asset for asset in self.javascripts if isinstance(asset, BabelJavascriptAsset)]
            compiled = ''
            if len(need_transpile) > 0:
                source = '\n'.join([asset.content for asset in need_transpile])
                compiler = need_transpile[0].compile 
                try:
                    compiled = compiler(source)
                    return compiled
                except CompileError as e:
                    return handle_compile_error(e, source=source)
            else:
                return compiled

    def js(self):
        # to override to run transpiler
        attachments = self.get_attachments('js')
        if not attachments or True:
            content = ';\n'.join([asset.minify() for asset in self.javascripts if not isinstance(asset, BabelJavascriptAsset)])      
            # append transpiled js at the end
            # this part needs improvement      
            content = content + ';\n' + self.transpile_babel()
            # print('---', content)
            return self.save_attachment('js', content)
        return attachments[0] 

class QWeb(models.AbstractModel):
    """ QWeb object for rendering stuff in the website context """

    _inherit = 'ir.qweb'

    def get_asset_bundle(self, xmlid, files, remains=None, env=None):
        return AssetsBundleBabel(xmlid, files, remains=remains, env=env)