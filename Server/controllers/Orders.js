/**
 * Created by Dudu on 05/01/2016.
 */

var server = require('../server.js')
var Order = require('../models/Order');
var Branch = require('../models/Branch');
var Car = require('../models/Car');

exports.getOrders = function (req, res) {
    if (JSON.parse(req.query.active)) {
        var now = new Date();
        Order.find({startDate: {$lte: now}, endDate: {$gte: now}}).populate('car').exec(function (err, orders) {
            if (!err) {
                res.json(orders);
            }
            else {
                //Utils.generateResponse(req, res, 0, err);
            }
        });
    }
    else {
        Order.find().populate('car').exec(function (err, orders) {
            if (!err) {
                //var cars = orders.map(function(order) {
                //    return order._doc.car;
                //});
                //
                //Car.populate(cars, {
                //    path: 'branch',
                //    select: 'title'
                //}, function(err,b) {
                //    var s = b;
                //});
                res.json(orders);
            }
            else {
                //Utils.generateResponse(req, res, 0, err);
            }
        });
    }
};

exports.createOrder = function (req, res) {
    var order = new Order();
    order.startDate = req.body.startDate;
    order.endDate = req.body.endDate;
    order.price = req.body.price;
    order.mission = req.body.mission;
    order.car = req.body.car_id;

    order.save(function (err) {
        if (!err) {
            res.json('order created');
            server.io.sockets.emit('newOrder', order);
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};

exports.deleteOrder = function (req, res) {
    Order.remove({_id: req.params.order_id}, function (err) {
        if (!err) {
            res.json('order deleted');
            server.io.sockets.emit('deleteOrder', req.params.order_id);
        }
        else {
            //Utils.generateResponse(req, res, 0, err);
        }
    });
};



