var aws = require('aws-sdk');
var doc = require('dynamodb-doc');
var fs = require('fs');

aws.config.update({
	accessKeyId: process.env.ACCESS_KEY || 'Temp',
	secretAccessKey: process.env.SECRET_KEY || 'Temp',
	endpoint: process.env.DYNAMODB_ENDPOINT || 'http://192.168.99.100:8000',
	region: process.env.AWS_REGION || 'us-east-1'
});

var schema = process.env.SCHEMA_LOCATION || './tables_dynamodb/';
var sampleData = process.env.DATA_LOCATION || './tables_dynamodb_sampledata/';

dynamodb = new doc.DynamoDB(new aws.DynamoDB());

fs.readdir(schema, function(err, items) {
	if (err) {
	    console.log(err);
	}
	else {
		makeTables(items);
	}
});

function makeTables(items){
	for (var i = 0; i < items.length; i++) {
		var table = items[i].split(".")[0];
		console.log('making table ' + table);
		makeTable(table, loadData(table))();
	}
}

var makeTable = function(tableName, cb) {
	return function() {
		dynamodb.deleteTable({ TableName: tableName }, function(err, data) {
		    if (err) {
		        console.log('error in delete for ' + tableName + ': ' + err);
		    }

	    	dynamodb.waitFor('tableNotExists', { TableName: tableName }, function(err, data) {
	    		var params = require(schema + tableName + '.json');
				dynamodb.createTable(params, function(err, data) {
					if (err) {
					    console.log('error in create for ' + tableName + ': ' + err);
					}

					dynamodb.waitFor('tableExists', { TableName: tableName }, function(err, data) {
					  	if (err) {
					  	    console.log(err, err.stack);
					  	}
					  	else {
							console.log('table created: ' + tableName);
				    		cb();
						}
					});
				});
	    	});
		});
	}
};

var loadData = function(tableName) {
	return function() {
		try {
			var items = require(sampleData + tableName + '.json');
		} catch (error) {
			console.log(error);
			return;
		}

		// batch write:
		var requestItem = {}
		requestItem[tableName] = [];

		batchWrite = function() {
		    var params = {
                RequestItems: requestItem
            }
		    dynamodb.batchWriteItem(params, function(err, data) {
                    if (err) {
                        console.log('error in batch write for ' + tableName + ': ' + err);
                    }
                    else {
                        console.log(JSON.stringify(data) + " items saved for " + tableName);
                    }
                });
		}

		for (var i = 0; i < items.length; i++) {
	        requestItem[tableName].push({
				PutRequest: {
					Item: items[i]
				}
			});

		    if (i % 25 === 0) {
		        console.log('in mod ' + i);
		        console.log(requestItem[tableName].length);
                batchWrite();
                requestItem[tableName] = [];
		    }

		}

		if (requestItem[tableName].length > 0) {
		    console.log('out mod ' + requestItem[tableName].length);
		    batchWrite();
		}

		// not batch write:
		/*
		for (var i = 0; i < items.length; i++) {
			var params = {
				TableName: tableName,
				Item: items[i]
			};

			dynamodb.putItem(params, function(err, data) {
			    if (err) console.log('error in write item for ' + tableName + ': ' + err); // an error occurred
			    else console.log('item saved for ' + tableName); // successful response
			});
		}
		*/

	}
}

