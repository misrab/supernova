module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Cube", 
  	{
  		labels:		{ type: DataTypes.ARRAY(DataTypes.STRING) },
  		types:		{ type: DataTypes.ARRAY(DataTypes.STRING) },
  		tidbits:	{ type: DataTypes.ARRAY(DataTypes.STRING) },
  		num_rows:	{ type: DataTypes.INTEGER, defaultValue: 0 },
  		data_path:	{ type: DataTypes.STRING, defaultValue: '' }
  	});	
}