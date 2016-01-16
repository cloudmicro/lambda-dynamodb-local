var aws = require('aws-sdk');
var doc = require('dynamodb-doc');
var fs = require('fs');

/*
var accessKeyId = process.env.ACCESS_KEY || 'Temp';
var secretAccessKey = process.env.SECRET_KEY || 'Temp';
var endpoint = process.env.DYNAMODB_ENDPOINT || 'http://192.168.99.100:8000';
var region = process.env.AWS_REGION || 'us-east-1';
*/

aws.config.update({
	accessKeyId: process.env.ACCESS_KEY || 'Temp',
	secretAccessKey: process.env.SECRET_KEY || 'Temp',
	endpoint: process.env.DYNAMODB_ENDPOINT || 'http://192.168.99.100:8000',
	region: process.env.AWS_REGION || 'us-east-1'
});

var schema = process.env.SCHEMA_LOCATION || './tables_dynamodb/';
var sampleData = process.env.DATA_LOCATION || './tables_dynamodb_sampledata/';

//NOTE: this is no longer necessary?
/*
process.argv.forEach(function (val, index, array) {
	if (index > 1){
		if (val.split("=").length == 2){
			console.log(index + ': ' + val);
			switch (val.split("=")[0].toLowerCase()) {
				case "accesskeyid":
					accessKeyId = val.split("=")[1];
					break;
				case "secretaccesskey":
					secretAccessKey = val.split("=")[1];
					break;
				case "endpoint":
					endpoint = val.split("=")[1];
					break;
				case "region":
					region = val.split("=")[1];
					break;
			}
		}
	}
});
*/



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

		for (var i = 0; i < items.length; i++) {
			requestItem[tableName].push({
				PutRequest: {
					Item: items[i]
				}
			});
		}

		var params = {
			RequestItems: requestItem
		}

		dynamodb.batchWriteItem(params, function(err, data) {
		    if (err) {
		        console.log('error in batch write for ' + tableName + ': ' + err);
		    }
		    else {
		    	console.log("items saved for " + tableName);
		    }
		});

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

