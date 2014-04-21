# trims a "row", from sides
# expects actual elements to be trimmed already
# !! expects there to be at least one nonempty element
def trim_row(row):
	i = 0
	j = len(row)-1
	start = row[i]
	end = row[j]
	
	while start=='' and i < len(row):
		i = i + 1
		start = row[i]
	while end=='' and j > 0:
		j = j - 1
		end = row[j]
	
	# return sublist
	return row[i:j+1]