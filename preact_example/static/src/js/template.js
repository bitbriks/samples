odoo.define('preact_example.exam', function (require) {
"use strict";

// var BasicComposer = require('mail.composer.Basic');
// var ExtendedComposer = require('mail.composer.Extended');
// var ThreadWidget = require('mail.widget.Thread');

var AbstractAction = require('web.AbstractAction');
var config = require('web.config');
var ControlPanelMixin = require('web.ControlPanelMixin');
var core = require('web.core');
var data = require('web.data');
var Dialog = require('web.Dialog');
var dom = require('web.dom');
var pyUtils = require('web.py_utils');
var SearchView = require('web.SearchView');
var session = require('web.session');

var QWeb = core.qweb;
var _t = core._t;

var TemplateView = require('preact_example.exam_main'); 


var Exam = AbstractAction.extend(ControlPanelMixin, {
    template: 'preact_example.template',
    custom_events: {
        search: '_onSearch',
    },
    /**
     * @override
     * @param {Object} [options]
     */
    init: function (parent, action, options) {
        this._super.apply(this, arguments);
        this.action = action;
        this.action_manager = parent;
        this.domain = [];
        this.options = options || {};
        this.dataset = new data.DataSetSearch(this, 'mail.message');
    },
    /**
     * @override
     */
    willStart: function () {
        // var self = this;
        // var viewID = this.action &&
        //                 this.action.search_view_id &&
        //                 this.action.search_view_id[0];
        // var def = this
        //     .loadFieldView(this.dataset, viewID, 'search')
        //     .then(function (fieldsView) {
        //         self.fields_view = fieldsView;
        //     });
        // return $.when(this._super(), this.call('mail_service', 'isReady'), def);
        return $.when();
    },
    /**
     * @override
     */
    start: function () {
        var self = this;
        // render step 
    
        // this._renderButtons();

        // var defs = [];
        // defs.push(
        //     this._renderThread()
        // );
        // defs.push(this._renderSearchView());

        // return this.alive($.when.apply($, defs));
        // this._renderThread();
        // var el = $('<h1>Hello World</h1>');
        // return el.appendTo(this.$('.o_mail_discuss_content'));
        TemplateView.render(TemplateView.component, this.$el[0]);
        return this.$el;
    },
    /**
     * @override
     */
    do_show: function () {
        this._super.apply(this, arguments);
        this._updateControlPanel();
        this.action_manager.do_push_state({
            action: this.action.id,
            active_id: this._thread.getID(),
        });
    },
    /**
     * @override
     */
    destroy: function () {
        if (this.$buttons) {
            this.$buttons.off().destroy();
        }
        this._super.apply(this, arguments);
    },

    
    /**
     * @private
     */
    _renderButtons: function () {
        // this.$buttons = $(QWeb.render('mail.discuss.ControlButtons', { debug: session.debug }));
        // this.$buttons.find('button').css({display:'inline-block'});
        // this.$buttons
        //     .on('click', '.o_mail_discuss_button_invite', this._onInviteButtonClicked.bind(this))
        //     .on('click', '.o_mail_discuss_button_mark_all_read', this._onMarkAllAsReadClicked.bind(this))
        //     .on('click', '.o_mail_discuss_button_unstar_all', this._onUnstarAllClicked.bind(this))
        //     .on('click', '.o_mail_discuss_button_moderate_all', this._onModerateAllClicked.bind(this))
        //     .on('click', '.o_mail_discuss_button_select_all', this._onSelectAllClicked.bind(this))
        //     .on('click', '.o_mail_discuss_button_unselect_all', this._onUnselectAllClicked.bind(this));
    },
    /**
     * @private
     * @returns {Deferred}
     */
    _renderSearchView: function () {
        // var self = this;
        // var options = {
        //     $buttons: $('<div>'),
        //     action: this.action,
        //     disable_groupby: true,
        // };
        // this.searchview = new SearchView(this, this.dataset, this.fields_view, options);
        // return this.alive(this.searchview.appendTo($('<div>')))
        //     .then(function () {
        //         self.$searchview_buttons = self.searchview.$buttons;
        //         // manually call do_search to generate the initial domain and filter
        //         // the messages in the default thread
        //         self.searchview.do_search();
        //     });
    },
    /**
     * Render the sidebar of discuss app
     *
     * @private
     * @param {Object} options
     * @param {mail.model.Thread[]} [options.threads=[]]
     * @returns {jQueryElement}
     */
    // _renderSidebar: function (options) {
    //     var inbox = this.call('mail_service', 'getMailbox', 'inbox');
    //     var starred = this.call('mail_service', 'getMailbox', 'starred');
    //     var moderation = this.call('mail_service', 'getMailbox', 'moderation');
    //     var $sidebar = $(QWeb.render('mail.discuss.Sidebar', {
    //         activeThreadID: this._thread ? this._thread.getID() : undefined,
    //         threads: options.threads,
    //         needactionCounter: inbox.getMailboxCounter(),
    //         starredCounter: starred.getMailboxCounter(),
    //         moderationCounter: moderation ? moderation.getMailboxCounter() : 0,
    //         isMyselfModerator: this.call('mail_service', 'isMyselfModerator'),
    //     }));
    //     return $sidebar;
    // },
    /**
     * @private
     * @param {string} template
     * @param {Object} context rendering context
     * @param {integer} [timeout=20000] the delay before the snackbar disappears
     */
    // _renderSnackbar: function (template, context, timeout) {
    //     if (this.$snackbar) {
    //         this.$snackbar.remove();
    //     }
    //     timeout = timeout || 20000;
    //     this.$snackbar = $(QWeb.render(template, context));
    //     this.$('.o_mail_discuss_content').append(this.$snackbar);
    //     // Hide snackbar after [timeout] milliseconds (by default, 20s)
    //     var $snackbar = this.$snackbar;
    //     setTimeout(function () { $snackbar.fadeOut(); }, timeout);
    // },
    /**
     * Renders, binds events and appends a thread widget.
     *
     * @private
     * @returns {Deferred}
     */
    _renderThread: function () {
        // this._threadWidget = new ThreadWidget(this, {
        //     loadMoreOnScroll: true
        // });

        // this._threadWidget
        //     .on('redirect', this, function (resModel, resID) {
        //         this.call('mail_service', 'redirect', resModel, resID, this._setThread.bind(this));
        //     })
        //     .on('redirect_to_channel', this, function (channelID) {
        //         this.call('mail_service', 'joinChannel', channelID).then(this._setThread.bind(this));
        //     })
        //     .on('load_more_messages', this, this._loadMoreMessages)
        //     .on('mark_as_read', this, function (messageID) {
        //         this.call('mail_service', 'markMessagesAsRead', [messageID]);
        //     })
        //     .on('toggle_star_status', this, function (messageID) {
        //         var message = this.call('mail_service', 'getMessage', messageID);
        //         message.toggleStarStatus();
        //     })
        //     .on('select_message', this, this._selectMessage)
        //     .on('unselect_message', this, this._unselectMessage);
        var el = $('<h1>Hello World</h1>');
        return el.appendTo(this.$('.o_mail_discuss_content'));
    },

    /**
     * @private
     * @param {OdooEvent} ev
     */
    _onSearch: function (ev) {
        ev.stopPropagation();
        // var session = this.getSession();
        // var result = pyUtils.eval_domains_and_contexts({
        //     domains: ev.data.domains,
        //     contexts: [session.user_context],
        // });
        // this.domain = result.domain;
        // if (this._thread) {
        // }
    },



});

core.action_registry.add('preact_example.example', Exam);

return Exam;

});
