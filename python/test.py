
from analytics.assimilation.utils import Processor
from analytics.assimilation import process_local_file


path = '../tmp/test.xlsx'
processor = Processor()
process_local_file(processor, path, '.xlsx')